import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../actions/auth";
import { useSnackbar } from "../components/SnackbarContext";
import registerImg from "../images/register.png";
import Section from "./Section";
import GoogleIcon from "./GoogleIcon";
import { useGoogleLogin } from "@react-oauth/google";
import { Icon } from "@iconify/react/dist/iconify.js";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [errors, setErrors] = useState({
    fName: "",
    lName: "",
    password: "",
    email: "",
    resetEmail: "",
    username: "",
  });
  const { message } = useSelector((state) => state.message);
  const snackbar = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const onChangeFName = (e) => {
    const fName = e.target.value;
    setFName(fName);
    setErrors({ ...errors, fName: "" });
    setDisabled(false);
  };

  const onChangeLName = (e) => {
    const lName = e.target.value;
    setLName(lName);
    setErrors({ ...errors, lName: "" });
    setDisabled(false);
  };

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
    setErrors({ ...errors, username: "" });
    setDisabled(false);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
    setErrors({ ...errors, email: "" });
    setDisabled(false);

    if (!validateEmail(email)) {
      setErrors({ ...errors, email: "Invalid email address" });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (value) => {
    const newErrors = {};
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!passwordRegex.test(value)) {
      if (!/(?=.*[A-Za-z])/.test(value)) {
        newErrors.password =
          "Password must contain at least one letter (a-z or A-Z)";
      } else if (!/(?=.*\d)/.test(value)) {
        newErrors.password = "Password must contain at least one digit (0-9)";
      } else if (!/(?=.*[@$!%*?&])/.test(value)) {
        newErrors.password =
          "Password must contain at least one special character (@$!%*?&)";
      } else if (value.length < 6) {
        newErrors.password = "Password must have at least 6 characters";
      }
    } else {
      newErrors.password = "";
    }

    setErrors({ ...errors, ...newErrors });

    return Object.keys(newErrors).length === 0;
  };

  const onChangePassword = (e) => {
    const value = e.target.value;
    setPassword(value);
    setDisabled(false);
    if (value.length === 0) {
      setErrors({ ...errors, password: "" });
    } else {
      validatePassword(value);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    const newErrors = {};

    if (!fName) {
      newErrors.fName = "Required";
    }

    if (!lName) {
      newErrors.lName = "Required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    }

    if (!username) {
      newErrors.username = "Username is required";
    }

    setErrors({ ...errors, ...newErrors });

    if (Object.keys(newErrors).length === 0 && validateEmail(email)) {
      try {
        dispatch(register(fName, lName, email, username, password));
        dispatch(login(username, password));
        navigate("/");
        snackbar.success(
          "Registration Successful! Please check your email for verification"
        );
      } catch {
        setError(true);
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError(false);
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

  return (
    <Box onSubmit={handleRegister} component="form" sx={{ display: "flex" }}>
      <Section
        title="Manage your schedule"
        subtitle="More effectively with optimized workflows"
        image={registerImg}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: "1 1 auto",
          alignItems: "center",
          padding: "24px 16px",
        }}
      >
        <Box sx={{ width: "450px" }}>
          <Stack spacing={1.5} sx={{ mb: 3 }}>
            <Typography variant="h5">Get started for free</Typography>

            <Stack direction="row" spacing={0.5}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Already have an account?
              </Typography>

              <Typography
                component={Link}
                to="/login"
                color="primary"
                sx={{ textDecoration: "none" }}
                variant="subtitle2"
              >
                Get started
              </Typography>
            </Stack>
          </Stack>
          <Stack spacing={3}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                error={Boolean(errors.fName)}
                helperText={errors.fName}
                margin={errors.fName ? "dense" : "normal"}
                InputLabelProps={{ shrink: true }}
                label="First Name"
                name="fName"
                value={fName}
                onChange={onChangeFName}
                variant="outlined"
              />
              <TextField
                fullWidth
                error={Boolean(errors.lName)}
                helperText={errors.lName}
                margin={errors.lName ? "dense" : "normal"}
                InputLabelProps={{ shrink: true }}
                label="First Name"
                name="lName"
                value={lName}
                onChange={onChangeLName}
                variant="outlined"
              />
            </Box>
            <TextField
              fullWidth
              error={Boolean(errors.username)}
              helperText={errors.username}
              margin={errors.username ? "dense" : "normal"}
              InputLabelProps={{ shrink: true }}
              label="Username"
              name="username"
              value={username}
              onChange={onChangeUsername}
              variant="outlined"
            />
            <TextField
              fullWidth
              error={Boolean(errors.email)}
              helperText={errors.email}
              margin={errors.email ? "dense" : "normal"}
              InputLabelProps={{ shrink: true }}
              label="Email"
              name="email"
              value={email}
              onChange={onChangeEmail}
              variant="outlined"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              value={password}
              onChange={onChangePassword}
              type={showPassword ? "text" : "password"}
              placeholder="6+ characters"
              InputLabelProps={{ shrink: true }}
              error={Boolean(errors.password)}
              helperText={
                /Password is/.test(errors.password) && "Password is required"
              }
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
              variant="outlined"
            />
            {errors.password && (
              <>
                {!/Password is/.test(errors.password) && (
                  <Alert severity="error" sx={{ my: 1 }}>
                    {errors.password}
                  </Alert>
                )}
              </>
            )}
            {message && error && !errors.password && (
              <>
                <Divider sx={{ my: 2 }} />
                <Alert severity="error">{message}</Alert>
              </>
            )}
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={disabled}
              loading={loading}
              loadingIndicator="Create Account..."
              onClick={handleRegister}
            >
              Create Account
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
            <IconButton>
              <Button
                fullWidth
                size="large"
                color="inherit"
                variant="outlined"
                onClick={() => googleLogin()}
                startIcon={<Icon icon="flat-color-icons:google" />}
              >
                Register with Google
              </Button>
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
