import axios from "axios";
const baseURL = "/api/blogs";

let token = null;

const setToken = newToken => {
    token = `bearer ${newToken}`;
};

const getAll = async () => {
    const response = await axios.get(baseURL);
    return response.data;
};

const createBlog = async newBlogObject => {
    const config = {
        headers: { Authorization: token }
    };
    const response = await axios.post(baseURL, newBlogObject, config);
    return response.data;
};

const increaseLike = async (id, updateBlogObject) => {
    const response = await axios.put(baseURL + `/${id}`, updateBlogObject);
    return response.data;
};
export default { getAll, setToken, createBlog, increaseLike };
