import axios from "axios";
import apiUrl from "../../Utility/APIUrl";

const config = {
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
};

function createNewType(type) {
  const body = { type: type };
  return axios.post(apiUrl.testurl + "/type", body, config);
}

export default createNewType;
