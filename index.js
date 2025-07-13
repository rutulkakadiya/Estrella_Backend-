require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 5001;
;
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();


app.use(cors({
  origin: "https://www.estrellametals.com",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.static('public', { extensions: ['js'], mimeType: 'application/javascript' }));
app.use(express.json());



const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com", // Replace with your webmail SMTP server
  port: 465, // Use 465 for SSL, 587 for TLS
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER, // your Gmail address
//     pass: process.env.EMAIL_PASS, // your Gmail App Password
//   },
// });




app.post("/send-email", async (req, res) => {

  console.log(req.body);

  const { name, phone, email, message } = req.body;

  try {

    let mailOptions = {
      from: process.env.EMAIL_USER,  // No-reply email for professional touch
      to: "contact@estrellametals.com",  // Recipient email
      subject: `Contact Inquiry`,  // Subject updated for insurance website
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #212121;">
          <p>Hello Team,</p>
          <p>You have received a new contact inquiry through the Estrella Metals website. Below are the details of the interested individual:</p>
          <hr style="border: 1px solid #D4A017;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #D4A017;">${email}</a></p>
          <p><strong>Contact No:</strong> ${phone}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #E5E5E5; padding: 10px; border-left: 4px solid #D4A017;">${message}</p>
          <hr style="border: 1px solid #D4A017;">
          <p style="font-size: 14px; color: #555;">This is an automated email. Please do not reply.</p>
        </div>
      `,
    };

    let mailOptionsToUser = {
      from: process.env.EMAIL_USER,  // No-reply email for professional touch
      to: email,  // Recipient email
      subject: `Thank you for contacting Estrella Metals`,  // Subject updated for insurance website
      html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #212121;">
      <p>Dear ${name},</p>

      <p>Thank you for contacting <strong>Estrella Metals</strong>. We have received your inquiry and truly appreciate your interest in our services.</p>

      <p>Our team will review your message and get back to you within <strong>24-48 business hours</strong>.</p>

      <hr style="border: 1px solid #D4A017;">

      <p><strong>Your submitted details:</strong></p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #D4A017;">${email}</a></p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong></p>
      <p style="background: #E5E5E5; padding: 10px; border-left: 4px solid #D4A017;">${message}</p>

      <hr style="border: 1px solid #D4A017;">

      <p style="font-size: 14px; color: #555;">
        If you need immediate assistance, feel free to reach out to us via the contact information below.
      </p>

      <p style="font-size: 15px;">
        Best regards,<br>
        <strong>Estrella Metals Team</strong><br>
        🌐 <a href="https://estrellametals.com" style="color: #D4A017;">https://estrellametals.com</a><br>
        📧 <a href="mailto:contact@estrellametals.com" style="color: #D4A017;">contact@estrellametals.com</a><br>
        📞 +91 96877 35517<br>
        📞 +61 481757652
      </p>

      <p style="font-size: 12px; color: #888;">This is an automated email. Please do not reply directly to this message.</p>
    </div>
  `

    };


    await transporter.sendMail(mailOptions);
    await transporter.sendMail(mailOptionsToUser);
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Email not sent!", error });
  }
});

app.listen(port, (err) => {
  err ? console.log(err) : console.log("Server Started On Port : " + port);
})