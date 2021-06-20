import axios from "axios";
import apiurl from "../../../Utility/APIUrl";

function login(user) {
  return axios.post(apiurl.authurl + "/signin/email", user);
}

export default login;
