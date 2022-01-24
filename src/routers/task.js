const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});
//If /tasks?completed=boolean ?  sort : return all tasks
//IF /tasks?limit ? limit the response : return all tasks
//IF /tasks?limit&skip ? limit the response and give pagination : return all tasks
//IF /tasks?sortBy=createdAt:desc ? sort by creation time : return all
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};
  const { completed, limit, skip, sortBy } = req.query;
  // console.log(sortBy);
  if (completed) match.completed = completed;
  if (sortBy) {
    const parts = sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(limit) || null,
        skip: parseInt(skip) || null,
        sort,
      },
    });
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});
router.get("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid field" });
  }
  try {
    const updatedTask = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    // const updatedTask = await Task.findById(req.params.id);

    if (!updatedTask) {
      return res.status(400).send("No such task found");
    }
    updates.map((update) => (updatedTask[update] = req.body[update]));
    await updatedTask.save();
    res.send(updatedTask);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const deletedTask = await Task.deleteOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!deletedTask) return res.status(400).send("No sach task");
    res.send(deletedTask);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
