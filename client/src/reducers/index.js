import { combineReducers } from "redux";
import classroom from "./classroom";
import message from "./message";
import event from "./event";
import auth from "./auth";

const rootReducer = combineReducers({
  event,
  auth,
  message,
  classroom,
});

export default rootReducer;
