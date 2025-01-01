import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { googleSignIn, login, resetPasswordRequest } from "../actions/auth";
import loginImg from "../images/login.png";
import Section from "./Section";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    username: "",
  });
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
    setErrors({ ...errors, username: "" });
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
    setErrors({ ...errors, password: "" });
  };

  const onChangeResetEmail = (e) => {
    const email = e.target.value;
    setResetEmail(email);
    setErrors({ ...errors, resetEmail: "" });
    setResetError(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newErrors = {};

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (!username) {
      newErrors.username = "Username is required";
    }

    setErrors({ ...errors, ...newErrors });

    if (Object.keys(newErrors).length === 0) {
      try {
        await dispatch(login(username, password));
        navigate("/");
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    } else {
      setError(false);
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setResetLoading(true);

    if (resetEmail) {
      dispatch(resetPasswordRequest(resetEmail))
        .then(() => {
          setResetLoading(false);
          handleClose();

          setResetEmail("");
        })
        .catch(() => {
          setResetLoading(false);
          setResetError(true);
        });
    } else {
      setErrors({ ...errors, resetEmail: "Email is required" });
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      dispatch(googleSignIn(response.access_token))
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          console.error("Google Sign-In failed:", error);
          setError(true);
        });
    },
    onError: () => {
      console.error("Google Sign-In Failed");
      setError(true);
    },
  });

  if (isLoggedIn) {
    navigate("/");
  }

  return (
    <>
      <Box onSubmit={handleLogin} component="form" sx={{ display: "flex" }}>
        <Section
          title="Hi, Welcome Back"
          subtitle="Let's learn more together today"
          image={loginImg}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: "1 1 auto",
            alignItems: "center",
            padding: "80px 16px",
          }}
        >
          <Box sx={{ width: "450px" }}>
            <Stack spacing={1.5} sx={{ mb: 3 }}>
              <Typography variant="h5">Sign in to your account</Typography>

              <Stack direction="row" spacing={0.5}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Don't have an account?
                </Typography>

                <Typography
                  component={Link}
                  to="/register"
                  color="primary"
                  sx={{ textDecoration: "none" }}
                  variant="subtitle2"
                >
                  Get started
                </Typography>
              </Stack>
            </Stack>
            <Stack spacing={3}>
              <TextField
                fullWidth
                margin="normal"
                label="Username"
                name="username"
                value={username}
                error={Boolean(errors.username)}
                helperText={errors.username}
                onChange={onChangeUsername}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
              <Stack spacing={1.5}>
                <Box
                  component={Link}
                  variant="body2"
                  color="inherit"
                  onClick={handleOpen}
                  sx={{ alignSelf: "flex-end", textDecoration: "none" }}
                >
                  Forgot Password?
                </Box>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Password"
                  name="password"
                  value={password}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  onChange={onChangePassword}
                  type={showPassword ? "text" : "password"}
                  placeholder="6+ Characters"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  required
                />
              </Stack>
              {message && error && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Alert severity="error">{message}</Alert>
                </>
              )}
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loadingIndicator="Login..."
                onClick={handleLogin}
                disabled={loading}
                loading={loading}
              >
                Login
              </LoadingButton>
            </Stack>
            <Divider
              sx={{
                my: 3,
                typography: "overline",
                color: "text.disabled",
                "&::before, :after": { borderTopStyle: "dashed" },
              }}
            >
              OR
            </Divider>
            <Stack direction="row" justifyContent="center" spacing={1}>
              <Button
                fullWidth
                size="large"
                color="inherit"
                variant="outlined"
                onClick={() => googleLogin()}
                startIcon={<Icon icon="flat-color-icons:google" />}
              >
                Continue with Google
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ ".MuiDialog-paper": { width: "320px" } }}
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            error={Boolean(errors.resetEmail)}
            helperText={errors.resetEmail}
            margin="normal"
            label="Email"
            name="email"
            value={resetEmail}
            onChange={onChangeResetEmail}
            variant="outlined"
          />
          {message && resetError && (
            <>
              <Divider sx={{ my: 2, mt: 1 }} />
              <Alert severity="error" sx={{ mb: 1 }}>
                {message}
              </Alert>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            onClick={handleForgotPassword}
            loadingIndicator="Send..."
            disabled={!resetEmail.length}
            loading={resetLoading}
          >
            Send
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
