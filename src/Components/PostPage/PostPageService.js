import axios from "axios";
import apiUrl from "../../Utility/APIUrl";

const config = {
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
};

function getPostById(id) {
  return axios.get(apiUrl.testurl + "/post/" + id);
}

export default getPostById;
