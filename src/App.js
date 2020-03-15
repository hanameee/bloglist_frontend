import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
const baseURL = "/api/blogs";

function App() {
    const [blogs, setBlogs] = useState();
    const blog =
        blogs &&
        blogs.map(blog => (
            <div
                className="blogItem"
                style={{ marginBottom: "10px" }}
                key={blog.id}
            >
                <li>writer: {blog.author}</li>
                <li>content: {blog.title}</li>
            </div>
        ));

    useEffect(() => {
        console.log("Useeffect");
        axios.get(baseURL).then(response => {
            setBlogs(response.data);
            console.log(response.data);
        });
    }, []);

    return (
        <div className="App">
            <div className="Container">
                <div class="Blog">
                    <h1>blog-list-frontend</h1>
                    <div className="blogList">
                        <ul>{blog}</ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
