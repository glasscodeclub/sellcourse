const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        },
    });

    const message = await transporter.sendMail({
        from: `${process.env.EMAIL}`,
        to: options.email,
        subject: options.subject,
        text: options.text
    });

    const info = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);
}

module.exports = sendEmail;