import axios from "axios";
import apiUrl from "../../Utility/APIUrl";

const config = {
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
};

function signup(user) {
  return axios.post(apiUrl.authurl + "/signup", user);
}

export default signup;

export const authority = () => {
  return axios.get(apiUrl.testurl + "/admin", config);
};
