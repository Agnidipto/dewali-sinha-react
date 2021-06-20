import axios from "axios";
import apiUrl from "../../Utility/APIUrl";

const config = {
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
};

const getAllTypes = () => {
  return axios.get(apiUrl.testurl + "/type/all");
};

export default getAllTypes;
