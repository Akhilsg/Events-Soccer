const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");
const { verifySignUp } = require("../middlewares");

router.post(
  "/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail],
  controller.signup
);

router.get("/verify-email/:token", controller.verifyEmail);
router.post("/reset-password-request", controller.resetPasswordRequest);
router.post("/reset-password", controller.resetPassword);
router.get("/validate-token/:token", controller.validateToken);
router.post("/signin", controller.signin);
router.post("/google-signin", controller.googleSignin);

module.exports = router;
