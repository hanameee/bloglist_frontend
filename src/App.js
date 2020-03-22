import React, { useState, useEffect } from "react";

import "./App.css";
import blogService from "./Services/blogs";
import loginService from "./Services/login";

function App() {
    const [blogs, setBlogs] = useState();
    const [user, setUser] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const handleLogin = async event => {
        event.preventDefault();
        try {
            const User = await loginService.login({ username, password });
            setUser(User);
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

    return (
        <div className="App">
            <div className="Container">
                <div className="Blog">
                    <h1>blog-list-frontend</h1>
                    {user ? (
                        <div className="blogList">
                            <p>{user.username} logged in</p>
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
