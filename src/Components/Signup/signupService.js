import axios from "axios";
import apiUrl from "../../Utility/APIUrl";

function signup(user) {
  return axios.post(apiUrl.authurl + "/signup", user);
}

export default signup;
