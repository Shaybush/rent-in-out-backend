const { validateUser, validateUserLogin } = require('../validations/userValid');
const bcrypt = require('bcrypt');
const { UserModel } = require('../models/userModel');
const {
  sendResetEmail,
  sendVerificationEmail,
  createToken,
} = require('../helpers/userHelper');
const { UserVerificationModel } = require('../models/userVerificationModel');
const path = require('path');
const { PasswordReset } = require('../models/passwordReset');
const {
  getUserDetailFromAccessToken,
} = require('../helpers/services/axiosService');
require('dotenv').config();

const saltRounds = 10;

exports.authCtrl = {
  signUp: async(req, res) => {
    let validBody = validateUser(req.body);
    if (validBody.error) {
      return res.status(400).json({ Messege: validBody.error.details });
    }
    try {
      let user = new UserModel(req.body);
      user.password = await bcrypt.hash(user.password, saltRounds);
      user.email = user.email.toLowerCase();
      await user.save();
      user.password = '********';
      // send verification email
      sendVerificationEmail(user, res);
      res.status(201).json({
        msg: `New user ${user.fullName.firstName} ${user.fullName.lastName} created!`,
      });
    } catch (err) {
      if (err.code === 11000) {
        return res
          .status(409)
          .json({ msg: 'Email already in system, try log in', code: 11000 });
      }
      console.error(err);
      res.status(500).json({ msg: 'err', err });
    }
  },
  login: async(req, res) => {
    if (req.body.token) {return this.authCtrl.loginGmail(req, res);}
    const validBody = validateUserLogin(req.body);
    if (validBody.error)
    {return res.status(401).json({ msg: validBody.error.details });}
    try {
      const user = await UserModel.findOne({
        email: req.body.email.toLowerCase(),
      });
      if (!user) {return res.status(401).json({ msg: 'User not found' });}
      const validPass = await bcrypt.compare(req.body.password, user.password);
      if (!validPass) {return res.status(401).json({ msg: 'Invalid password' });}

      const { active } = user;
      if (!active) {
        return res
          .status(401)
          .json({ msg: 'User blocked/ need to verify your email' });
      }
      let newAccessToken = createToken(user._id, user.role);
      return res.json({ token: newAccessToken, user });
    } catch (err) {
      return res.status(500).json({ msg: 'There was an error signing' });
    }
  },

  verifyUser: async(req, res) => {
    let { userId, uniqueString } = req.params;
    try {
      const user = await UserVerificationModel.findOne({ userId });
      // check if user exist in system
      const { expiresAt } = user;
      const hashedUniqueString = user.uniqueString;
      if (user) {
        // checkes if link expired and sent a messege, delete verify collection in db
        if (expiresAt < Date.now() + 2 * 60 * 60 * 1000) {
          try {
            // if expired delete verify collection
            await UserVerificationModel.deleteOne({ userId });
            await UserModel.deleteOne({ _id: userId });
            let message = 'Link has expired. please sigh up again ';
            res.redirect(`/users/verified/?error=true&message=${message}`);
          } catch (error) {
            let message =
              'an error occurre while clearing expired user verification record';
            res
              .status(401)
              .json({ msg: `/users/verified/?error=true&message=${message}` });
          }
        } else {
          let result = await bcrypt.compare(uniqueString, hashedUniqueString);
          if (result) {
            try {
              // update user to active state
              let update = await UserModel.updateOne(
                { _id: userId },
                { active: true }
              );
              if (update) {
                // delete verify user collection when verified
                await UserVerificationModel.deleteOne({ userId });
                res.sendFile(path.join(__dirname, './../views/verified.html'));
              } else {
                // fail on update user collection
                let message = 'an error occurre while updating user verified ';
                res.status(401).json({
                  msg: `/users/verified/?error=true&message=${message}`,
                });
              }
            } catch {
              // couldnt verify user details
              await UserVerificationModel.deleteOne({ userId });
              await UserModel.deleteOne({ _id: userId });
              let message =
                'invalid verification details passed.check your inbox.';
              res.redirect(`/users/verified/?error=true&message=${message}`);
            }
          } else {
            // couldnt verify unique string
            await UserVerificationModel.deleteOne({ userId });
            await UserModel.deleteOne({ _id: userId });
            let message =
              'an error occurre while compering vrification sentence';
            res
              .status(401)
              .json({ msg: `/users/verified/?error=true&message=${message}` });
          }
        }
      } else {
        // account alredy verified or not exist
        let message =
          'Account doesnt exist or has been verified already. Please sign up or login in.';
        res.redirect(`/users/verified/?error=true&message=${message}`);
      }
    } catch (error) {
      // user verification record not found in DB
      let delVer = await UserVerificationModel.deleteOne({ uniqueString });
      let message =
        'an error occurre while checking for existing user Verification record ';
      res.redirect(`/users/verified/?error=true&message=${message}`);
    }
  },
  verifiedUser: async(req, res) => {
    res.sendFile(path.join(__dirname, '../views/verified.html'));
  },
  requestPasswordReset: async(req, res) => {
    const { email, redirectUrl } = req.body;
    UserModel.findOne({ email }).then((data) => {
      if (data) {
        // check if user is active
        if (!data.active) {
          res.json({
            status: 'failed',
            message:
              'Email isn\'t verified yet or account as been suspended, please check your email',
          });
        } else {
          // procced to email reset pasword
          sendResetEmail(data, redirectUrl, res);
        }
      } else {
        res.json({
          status: 'failed',
          message: 'No account with the supplied email found. Please try again',
        });
      }
    });
  },
  resetPassword: async(req, res) => {
    const { userId, resetString, newPassword } = req.body;
    try {
      let result = await PasswordReset.findOne({ userId });
      if (result) {
        const { expiresAt } = result;
        const hashedResetString = result.resetString;
        if (expiresAt < Date.now() + 2 * 60 * 60 * 1000) {
          // checking if link expired
          let reset = await PasswordReset.deleteOne({ userId });
          if (!reset) {
            return res
              .status(401)
              .json({ msg: 'Password reset link as expired', err });
          }
        } else {
          // compare reset string with string from db
          let result = await bcrypt.compare(resetString, hashedResetString);
          if (result) {
            const hashedNewPassword = await bcrypt.hash(
              newPassword,
              saltRounds
            );
            if (hashedNewPassword) {
              // update user password
              let update = await UserModel.updateOne(
                { _id: userId },
                {
                  password: hashedNewPassword,
                  updatedAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
                }
              );
              if (update) {
                // update completed
                let reset = await PasswordReset.deleteOne({ userId });
                if (reset) {
                  return res.status(200).json({
                    status: 'Success',
                    msg: 'Password reset successfully',
                  });
                } else {
                  return res
                    .status(401)
                    .json({ msg: 'Failed to update user password', error });
                }
              }
            }
          } else {
            return res.status(401).json({ msg: 'Invalid password details' });
          }
        }
      } else {
        // password reset request not found
        return res
          .status(401)
          .json({ msg: 'Password reset request not found' });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ msg: 'Checking for existing password recors failed', err });
    }
  },
  // Gmail controllers
  loginGmail: async(req, res) => {
    try {
      let google_email;
      const google_token = req.body.token;
      // try to recieve google email from token
      if (google_token) {
        try {
          const response = await getUserDetailFromAccessToken(google_token);
          google_email = response.data?.email;
        } catch (err) {
          return res.status(500).json({ msg: 'Couldn\'t login google', err });
        }
      }
      const user = await UserModel.findOne({
        email: google_email,
      });
      if (!user) {return res.status(401).json({ msg: 'User not found' });}

      const { active } = user;
      if (!active) {
        return res
          .status(401)
          .json({ msg: 'User blocked/ need to verify your email' });
      }
      let newAccessToken = createToken(user._id, user.role);
      return res.json({ token: newAccessToken, user });
    } catch (err) {
      return res.status(500).json({ msg: 'There was an error signing' });
    }
  },
};
