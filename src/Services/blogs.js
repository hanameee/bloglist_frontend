import axios from "axios";
const baseURL = "/api/blogs";

const getAll = async () => {
    const response = await axios.get(baseURL);
    return response;
};

export default { getAll };
