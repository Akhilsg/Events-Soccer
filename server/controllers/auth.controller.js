const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: "schedulex.edu@hotmail.com",
    pass: "SCHEDULEX@password.edu8642",
  },
});

const signup = (req, res) => {
  const verificationToken = crypto.randomBytes(20).toString("hex");
  const verificationTokenExpiration = Date.now() + 3600000;

  const user = new User({
    fName: req.body.fName,
    lName: req.body.lName,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    emailVerificationToken: verificationToken,
    emailVerificationTokenExpiration: verificationTokenExpiration,
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });

  const verificationLink = `https://localhost:5000/api/auth/verify-email/${verificationToken}`;
  const options = {
    to: req.body.email,
    from: '"ScheduleX Support" <schedulex.edu@hotmail.com>',
    subject: "Verify your email address",
    html: `
      <div style="background-color: #f4f4f4; padding: 20px; font-family: Poppins">
        <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #333; font-size: 24px; margin: 0;">
            Hello ${req.body.username},
          </h1>
          <p style="color: #333;">
            Thank you for signing up for our service. Please click the link
            below to verify your email address:
          </p>
          <p style="text-align: center;">
            <a
              href="${verificationLink}"
              style="
                display: inline-block; 
                background: rgb(171, 224, 152);
                background: linear-gradient(
                  90deg,
                  rgb(182, 243, 159) 0%,
                  rgba(131, 212, 117, 1) 35%,
                  rgba(46, 182, 44, 1) 100%
                ); 
                color: #fff; 
                text-decoration: none; 
                padding: 10px 20px; 
                border-radius: 5px;
                "
            >
              Verify Email
            </a>
          </p>
          <p style="color: #333;">This link will expire in one hour.</p>
        </div>
      </div>
    `,
  };
  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Sent" + info.response);
  });
};

const verifyEmail = async (req, res, next) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token." });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpiration = null;
    await user.save();

    res.json({ message: "Email verified successfully. You may now log in." });
  } catch (err) {
    next(err);
  }
};

const resetPasswordRequest = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No user found based on email." });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiration = Date.now() + 3600000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiration = resetTokenExpiration;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    const emailOptions = {
      to: email,
      from: '"ScheduleX Support" <schedulex.edu@hotmail.com>',
      subject: "Password Reset",
      html: `
        <p>You are receiving this email because you (or someone else) has requested a password reset for your account.</p>
        <p>Please click the following link to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>If you did not request this, please ignore this email, and your password will remain unchanged.</p>
      `,
    };

    transporter.sendMail(emailOptions, (err, info) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Failed to send reset password email." });
      }
      console.log("Password reset email sent: " + info.response);
      res.json({ message: "Password reset email sent successfully." });
    });
  } catch (err) {
    next(err);
  }
};

const validateToken = async (req, res, next) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token is invalid or expired." });
    }
  } catch (err) {
    next(err);
  }
};

const signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400,
      });

      var authorities = [];
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      res.status(200).send({
        id: user._id,
        username: user.username,
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        roles: authorities,
        accessToken: token,
      });
    });
};

const googleSignin = async (req, res) => {
  const { access_token } = req.body;

  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    
    const data = await response.json();
    const { email, given_name: fName, family_name: lName, picture: profileImage } = data;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        fName: fName,
        lName: lName,
        email: email,
        googleAccessToken: access_token,
        profileImage: {
          data: Buffer.from(profileImage),
          contentType: "image/png",
        },
        isEmailVerified: true,
        firstSignIn: true,
      });

      await user.save();
    } else {
      // Update the existing user's access token
      user.googleAccessToken = access_token;
      await user.save();
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });

    const firstSignIn = user.firstSignIn;

    res.status(200).json({
      id: user._id,
      username: user.username,
      fName: user.fName,
      lName: user.lName,
      email: user.email,
      profileImage: user.profileImage,
      roles: user.roles,
      accessToken: token,
      firstSignIn: firstSignIn,
      googleAccessToken: access_token
    });

    if (firstSignIn) {
      user.firstSignIn = false;
      await user.save();
    }
  } catch (error) {
    console.error("Google Sign-In error", error);
    return res.status(500).json({ message: "Google Sign-In failed." });
  }
};
const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token." });
    }

    const isSamePassword = bcrypt.compareSync(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        message: "New password cannot be the same as the old password.",
      });
    }

    user.password = bcrypt.hashSync(newPassword, 8);
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiration = null;

    await user.save();

    res.json({
      message:
        "Password reset successful. You can now log in with your new password.",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  verifyEmail,
  signin,
  googleSignin,
  resetPasswordRequest,
  validateToken,
  resetPassword,
};
