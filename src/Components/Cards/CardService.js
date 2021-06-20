import axios from "axios";
import apiUrl from "../../Utility/APIUrl";

const config = {
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
};

function deletePost(id) {
  return axios.delete(apiUrl.testurl + `/post/${id}`);
}

export default deletePost;
