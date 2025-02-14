import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth/authSlice";
import { homeReducer } from "../features/home/homeSlice";
import { usersReducer } from "../features/users/usersSlice";
import { questionsReducer } from "../features/questions/questionsSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  home: homeReducer,
  users: usersReducer,
  questions: questionsReducer,
});
