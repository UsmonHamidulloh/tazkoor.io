const nodemailer = require("nodemailer");
const config = require("../../config/nodemailer");

const transporter = nodemailer.createTransport(config);

module.exports = function ({ adress, subject, text, html }) {
  const mailOptions = {
    from: config.auth.user,
    to: adress,
    subject: subject,
    text: text,
    html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error(error);
    } else {
      console.info("Email sent: " + info.response);

      return info.response;
    }
  });
};
