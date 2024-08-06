const bcrypt = require('bcrypt');
import { UserVerificationModel } from '../models/userVerificationModel';
import { PasswordReset } from '../models/passwordReset';
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const { config } = require('../config/config');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
// populate creator filter
export const select = {'_id':1 , 'fullName':1 , 'email' :1 ,'profile_img':1 , 'country' :1 ,'city':1 , 'phone' :1, 'createdAt': 1, 'likes': 1 };
export const createToken = (_id, role) =>{
  let token = jwt.sign({_id,role}, config.tokenSecret,{expiresIn:'15h'});
  return token;
};

// import email props
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: config.gmailUser,
    pass: config.gmailPass
  }
});

const mailOptions = (_id='',_uniqueString='' ,_email , _subject , _html) => {
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: _email,
    subject: _subject,
    html: _html
  };

  return mailOptions;
};

export const sendVerificationEmail = async({ _id, email }, res) => {
  const uniqueString = uuidv4() + _id;
  const html =`<p>Verify Your Email </p><p> click <a href=${config.domain+'/users/verify/'+_id+'/'+uniqueString}> here</a></p>`;

  // creat an unique string
  // create email options for spcific collection
  let mail = mailOptions(_id,uniqueString,email , 'Verify Your Email' , html);
  await bcrypt.hash(uniqueString, saltRounds)
    // hashed the unique string
    .then((hasheduniqueString) => {
      // create ne collection in verify user model
      const userVerification = new UserVerificationModel({
        userId: _id,
        uniqueString: hasheduniqueString,
      });
      userVerification.save()
        .then(() => {
          // send the email notification
          transporter.sendMail(mail, (err, info) => {
            if (err) {
              console.error(err);
            }
          });
        })
        .catch((error) => {
          console.error(error);
          res.json({
            status: 'failed',
            message: 'an error  cant save',
          });
        });

    });
};
// redirect url is an frontend url were we reset password
export const sendResetEmail = async({_id , email} , redirectUrl , res)=>{
  // if request already in system
  let request = await PasswordReset.findOne({_id});
  if(request) {await PasswordReset.deleteOne({_id});}

  const resetString = uuidv4() + _id;
  const html = `<p>We heard that you forgot your password.</p>
    <p>Don't worry, use the link below to reset it.</p>
    <p>This link <b>expires in 60min </b></p>
    <p>Press <a href=${redirectUrl +'/'+_id+'/'+ resetString}>here</a></p>`;
    // clear all existing request for the same user
  let mail = mailOptions(_id, resetString , email , 'Password reset' , html);
  PasswordReset.deleteMany({userId : _id})
    .then(result =>{
      bcrypt.hash(resetString, saltRounds)
        // create new password request
        .then(hashedResetString => {
          const newPasswordReset = new PasswordReset({
            userId : _id,
            resetString : hashedResetString,
          });
          newPasswordReset.save()
            .then(() => {
              // send the email notification
              transporter.sendMail(mail , (err, info) => {
                return res.json({
                  status: 'Pending',
                  message: 'Password reset email sent'
                });
              });
            });
        });
    })
    .catch((error)=>{
      console.error(error);
      res.json({
        status: 'failed',
        message: 'Error while cleaning existing requests',
      });
    });
};