import nodemailer from "nodemailer";

export const sendEmailWithMeetingLink = async (meetingLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: "roy.coc733@gmail.com",
    to: ["ankit25aeccse@gmail.com"],
    subject: "Zoom Training Session Invitation",
    text: `You are invited to a Zoom training session. Join the meeting using this link: ${meetingLink}`,
    html: `<p>You are invited to a Zoom training session. Join the meeting using this link: <a href="${meetingLink}">${meetingLink}</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};
