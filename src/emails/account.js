const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (emailId, name) => {
  sgMail.send({
    to: emailId,
    from: "ajayjarhad1@gmail.com",
    subject: "Thanks for joining",
    text: `Welcome to the app ${name}, let me know how you get along with the App`,
  });
};

const sendCancellationEmail = (emailId, name) => {
  sgMail.send({
    to: emailId,
    from: "ajayjarhad1@gmail.com",
    subject: "Sorry to see you go",
    text: `Sorry to see you go, ${name}`,
  });
};
module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
};
