import axios from "axios";
import apiUrl from "../../Utility/APIUrl";

const config = {
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
};

export const getTypePostsCount = (type) => {
  return axios.get(apiUrl.testurl + `/post/count`, { params: { type: type } });
};

export const getTypePage = (name, count = 0) => {
  return axios.get(apiUrl.testurl + `/type/${count}/2`, {
    params: { type: name },
  });
};

export default getTypePostsCount;
