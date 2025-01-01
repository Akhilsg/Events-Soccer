import axios from "axios";

const API_URL = "http://localhost:5000/auth/";

const register = (fName, lName, username, email, password) => {
  return axios.post(API_URL + "signup", {
    fName,
    lName,
    username,
    email,
    password,
  });
};

const verifyEmail = (token) => {
  return axios.get(API_URL + `verify-email/${token}`);
};

const login = async (username, password) => {
  const response = await axios.post(API_URL + "signin", {
    username,
    password,
  });
  if (response.data.accessToken) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const googleSignIn = async (access_token) => {
  return axios
    .post(API_URL + "google-signin", { access_token })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};

const resetPasswordRequest = (email) => {
  return axios.post(API_URL + "reset-password-request", {
    email,
  });
};

const resetPassword = (token, newPassword) => {
  return axios.post(API_URL + "reset-password", {
    token,
    newPassword,
  });
};

const verifyToken = (token) => {
  return axios.get(API_URL + `validate-token/${token}`);
};

const logout = () => {
  localStorage.removeItem("user");
};

export default {
  register,
  verifyEmail,
  login,
  googleSignIn,
  logout,
  resetPasswordRequest,
  resetPassword,
  verifyToken,
};
