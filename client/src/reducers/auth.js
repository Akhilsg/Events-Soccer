import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  RESET_PASSWORD_REQUEST_SUCCESS,
  RESET_PASSWORD_REQUEST_FAIL,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  VERIFY_EMAIL_SUCCESS,
  VERIFY_EMAIL_FAIL,
  VERIFY_TOKEN_SUCCESS,
  VERIFY_TOKEN_FAIL,
} from "../types/types";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = user
  ? { isLoggedIn: true, user }
  : { isLoggedIn: false, user: null };

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
      };
    case REGISTER_FAIL:
      return {
        ...state,
        isLoggedIn: false,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user: payload.user,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    case RESET_PASSWORD_REQUEST_SUCCESS:
      return {
        ...state,
      };
    case RESET_PASSWORD_REQUEST_FAIL:
      return {
        ...state,
      };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
      };
    case RESET_PASSWORD_FAIL:
      return {
        ...state,
      };
    case VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
      };
    case VERIFY_EMAIL_FAIL:
      return {
        ...state,
      };
    case VERIFY_TOKEN_SUCCESS:
      return {
        ...state,
      };
    case VERIFY_TOKEN_FAIL:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default authReducer;
