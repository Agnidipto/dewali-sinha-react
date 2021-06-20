import axios from "axios";
import apiUrl from "../../Utility/APIUrl";

const config = {
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
};
function authority() {
  return axios.get(apiUrl.testurl + "/admin", config);
}

export default authority;

export const getTypeCount = () => {
  return axios.get(apiUrl.testurl + "/type/count");
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

export const deletePost = (id) => {
  return axios.delete(apiUrl.testurl + `/post/${id}`);
};

export const getTypePosts = (type) => {
  return axios.get(apiUrl.testurl + `/type`, { params: { type: type } });
};

export const getTypePostsCount = (type) => {
  return axios.get(apiUrl.testurl + `/post/count`, { params: { type: type } });
};

export const deleteType = (type) => {
  return axios.delete(apiUrl.testurl + `/type/`, { params: { type: type } });
};
//Web Contents

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

export const postWebContent = (name, heading, content) => {
  const fd = new FormData();
  fd.append("name", name);
  fd.append("heading", heading);
  fd.append("content", content);
  return axios.post(apiUrl.testurl + `/webcontent`, fd, config);
};

export const deleteWebContent = (id) => {
  return axios.delete(apiUrl.testurl + `/webcontent/${id}`);
};
//Web Pictures

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

async function getPicture(croppedImage, name) {
  if (croppedImage == null) return null;
  const config = { responseType: "blob" };
  const response = await axios.get(croppedImage, config);
  const file = new File([response.data], name, {
    type: response.data.type,
  });
  return file;
}

export const postWebPicture = async (name, heading, picture) => {
  const fd = new FormData();
  if (name) fd.append("name", name);
  if (heading) fd.append("heading", heading);
  if (picture) fd.append("file", await getPicture(picture, name));
  return axios.post(apiUrl.testurl + "/webpicture", fd, config);
};

export const deleteWebPicture = (id) => {
  return axios.delete(apiUrl.testurl + `/webpicture/${id}`);
};
