import React, { useState, useEffect } from "react";

import "./App.css";
import blogService from "./Services/blogs";
import loginService from "./Services/login";

function App() {
    const [blogs, setBlogs] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const handleLogin = async event => {
        event.preventDefault();
        try {
            const User = await loginService.login({ username, password });
        } catch (exception) {
            console.log(exception);
        }
    };
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
    const loginForm = () => (
        <form onSubmit={handleLogin}>
            <div>
                username:
                <input
                    type="text"
                    name="Username"
                    value={username}
                    onChange={({ target }) => {
                        setUsername(target.value);
                    }}
                />
            </div>
            <div>
                password:
                <input
                    type="password"
                    name="Password"
                    value={password}
                    onChange={({ target }) => {
                        setPassword(target.value);
                    }}
                />
            </div>
            <button type="submit">login</button>
        </form>
    );
    useEffect(() => {
        blogService.getAll().then(response => setBlogs(response.data));
    }, []);

    return (
        <div className="App">
            <div className="Container">
                <div className="Blog">
                    <h1>blog-list-frontend</h1>
                    <div className="blogList">
                        {loginForm()}
                        <ul>{blog}</ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
