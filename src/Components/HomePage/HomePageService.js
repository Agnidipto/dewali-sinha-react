import axios from "axios";
import apiUrl from "../../Utility/APIUrl";

const config = {
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
};

export const getWebPictureHeadings = () => {
  return axios.get(apiUrl.testurl + "/webpicture/headings");
};

export const getWebPictureByHeading = (heading) => {
  const fd = new FormData();
  fd.append("heading", heading);
  return axios.get(apiUrl.testurl + `/webpicture/heading/`, {
    ...config,
    params: { heading: heading },
  });
};

const getWebPictureByName = (name) => {
  return axios.get(apiUrl.testurl + `/webpicture/name`, {
    params: { name: name },
  });
};

export default getWebPictureByName;

export const getWebContentHeadings = () => {
  return axios.get(apiUrl.testurl + `/webcontent/headings`);
};

export const getWebContentByHeading = (heading) => {
  const fd = new FormData();
  fd.append("heading", heading);
  return axios.get(apiUrl.testurl + `/webcontent/heading/`, {
    ...config,
    params: { heading: heading },
  });
};

export const getWebContentByName = (name) => {
  return axios.get(apiUrl.testurl + `/webcontent/name`, {
    params: { name: name },
  });
};

export const getTypePage = (name, count = 3) => {
  if (count < 1) count = 1;
  return axios.get(apiUrl.testurl + `/type/0/${count}`, {
    params: { type: name },
  });
};

export const getAllTypes = () => {
  return axios.get(apiUrl.testurl + "/type/all");
};
