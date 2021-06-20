import axios from "axios";
import apiUrl from "../../Utility/APIUrl";

const config = {
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
};

export const getTypePostsCount = (type) => {
  return axios.get(apiUrl.testurl + `/post/count`, { params: { type: type } });
};

export const getTypePage = (name, count = 3) => {
  if (count < 1) count = 1;
  return axios.get(apiUrl.testurl + `/type/0/${count}`, {
    params: { type: name },
  });
};

export default getTypePostsCount;
