import axios from "axios";

export const instance = axios.create({
  baseURL: "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api",
});

instance.interceptors.response.use(function (response) {
  return response.data;

});