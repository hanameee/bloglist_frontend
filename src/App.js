import React, { useState, useEffect } from "react";

import "./App.css";
import blogService from "./Services/blogs";
import loginService from "./Services/login";

function App() {
    const [blogs, setBlogs] = useState();
    const [user, setUser] = useState();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async event => {
        event.preventDefault();
        try {
            const User = await loginService.login({ username, password });
            window.localStorage.setItem(
                "loggedBlogAppUser",
                JSON.stringify(User)
            );
            setUser(User);
            setUsername("");
            setPassword("");
        } catch (exception) {
            console.log(exception);
        }
    };

    const handleLogout = () => {
        window.localStorage.removeItem("loggedBlogAppUser");
        window.location.reload(true);
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

    const loginForm = () => {
        if (user == null)
            return (
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
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
    };

    useEffect(() => {
        blogService.getAll().then(response => setBlogs(response.data));
    }, []);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
        if (loggedUserJSON) {
            const User = JSON.parse(loggedUserJSON);
            setUser(User);
        }
    }, []);

    return (
        <div className="App">
            <div className="Container">
                <div className="Blog">
                    {user ? (
                        <div className="blogList">
                            <h1>blog-list-frontend</h1>
                            <p>
                                {user.username} logged in{" "}
                                <button onClick={handleLogout}>logout</button>
                            </p>
                            <ul>{blog}</ul>
                        </div>
                    ) : (
                        loginForm()
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
