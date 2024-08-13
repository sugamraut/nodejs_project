const nodeMailer = require("nodemailer");
const sendEmail = async (data) => {
  let transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: "sugamrautbim@gamil.com",
      pass: "zaihwyzmqnywoqev",
    },
  });
  let mailOptions = {
    from: "sugam raut<sugamraut9955@gmail.com>",
    to: data.email,
    subject: data.subject,
    text: data.text,
  };
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
