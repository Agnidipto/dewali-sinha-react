import axios from "axios";
import apiUrl from "../../Utility/APIUrl";

const config = {
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
};
export const authority = () => {
  return axios.get(apiUrl.testurl + "/admin", config);
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

async function savePost(post, files) {
  var fd = new FormData();
  if (post.name) fd.append("name", post.name);
  if (post.description) fd.append("description", post.description);
  if (post.type) fd.append("type", post.type);
  fd.append("material", post.materials);
  const config = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  fd.append("file1", await getPicture(files.file1, "file1"));

  fd.append("file2", await getPicture(files.file2, "file2"));

  fd.append("file3", await getPicture(files.file3, "file3"));

  return axios.post(apiUrl.testurl + "/posts", fd, {
    ...config,
    material: post.materials,
  });
}

export default savePost;

export const getPostById = (id) => {
  return axios.get(apiUrl.testurl + "/post/" + id);
};

export const editPost = async (id, post, files) => {
  var fd = new FormData();
  if (post.name) fd.append("name", post.name);
  if (post.description) fd.append("description", post.description);
  if (post.type) fd.append("type", post.type);
  fd.append("material", post.materials);
  const config = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  fd.append("file1", await getPicture(files.file1, "file1"));

  fd.append("file2", await getPicture(files.file2, "file2"));

  fd.append("file3", await getPicture(files.file3, "file3"));
  fd.append("material", post.materials);

  return axios.put(apiUrl.testurl + `/post/${id}`, fd, config);
};
