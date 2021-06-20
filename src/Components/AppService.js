import axios from "axios";
import apiUrl from "../Utility/APIUrl";

function refreshToken() {
  const body = { refreshToken: localStorage.getItem("refreshToken") };
  return axios.post(apiUrl.authurl + "/refreshtoken", body);
}

export default refreshToken;
