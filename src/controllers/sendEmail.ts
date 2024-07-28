import { Request, Response } from 'express';
import { config } from '../config/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: config.gmailUser,
    pass: config.gmailPass
  }
});

const mailOptions = (_email: string , _subject: string , _html: string) => {
  return {
    from: config.gmailUser,
    to: config.gmailUser,
    subject: _subject,
    html: _html
  };
};

exports.mailMe = {
  sendEmail: async(req: Request, res: Response) => {
    let subject = 'mail send from ' + req.body.phone;
    let htmlMessage = `<div color:danger> <h2>${req.body.firstName} - ${req.body.lastName}</h2> <span>${req.body.phone}</span> | <span>${req.body.email}</span> <p>${req.body.textarea}</p> </div>`;
    const email = mailOptions(req.body.email, subject, htmlMessage);
    try {
      transporter.sendMail(email, () => {
        res.json({
          status: 'send',
          message: 'The message sent successfully'
        });
        return;
      });
    }
    catch (err) {
      return res.json({ err: 'There was an issue.' });
    }
  }
};






