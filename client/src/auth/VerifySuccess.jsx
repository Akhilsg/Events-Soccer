import { Alert, CircularProgress, Grow, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { verifyEmail } from "../actions/auth";
import { useSnackbar } from "../components/SnackbarContext";

export default function VerifySuccess() {
  const { message } = useSelector((state) => state.message);
  const { token } = useParams();
  const snackbar = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(5);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);

    const verifyAndRedirect = async () => {
      try {
        await dispatch(verifyEmail(token));
        navigate("/login");
        snackbar.success("Your email has been verified. You can now login.");
      } catch (error) {
        setError(true);
        setLoading(false);
        if (error) {
          snackbar.error(message);
        }
      }
    };

    verifyAndRedirect();
  }, []); // eslint-disable-line

  useEffect(() => {
    if (timer > 0) {
      const timerId = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else {
      navigate("/register");
    }
  }, [timer, navigate]);

  return (
    <div>
      {loading && <CircularProgress />}
      {error && !loading && (
        <>
          <Grow in>
            <Alert severity="error">{message}</Alert>
          </Grow>
          <br />
          <Typography>
            {timer > 0 && (
              <div>
                Redirecting you to Sign up page in in {timer.toFixed(0)}{" "}
                seconds...
              </div>
            )}
          </Typography>
        </>
      )}
    </div>
  );
}
