import nodemailer from "nodemailer"
export const sendEmail = async (to, subject, content) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,  
            pass: process.env.EMAIL_PASS  
        }
    });
    const mailOptions = {
        from: `Dragon store Team  <${process.env.EMAIL_USER}>`,
        to: to,      
        subject: subject,
        text: content  
    };
    return await transporter.sendMail(mailOptions);
};