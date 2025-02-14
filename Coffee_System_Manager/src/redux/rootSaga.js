import { all } from "redux-saga/effects";
import { authWatcher } from "../features/auth/authSaga";
import { homeWatcher } from "../features/home/homeSaga";
import { usersWatcher } from "../features/users/usersSaga";
import { questionsWatcher } from "../features/questions/questionsSaga";

export function* rootSaga() {
  yield all([...authWatcher]);
  yield all([...homeWatcher]);
  yield all([...usersWatcher]);
  yield all([...questionsWatcher]);
}
