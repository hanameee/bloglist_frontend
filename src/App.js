import React, { useState, useEffect } from "react";

import "./App.css";
import blogService from "./Services/blogs";
import loginService from "./Services/login";
import Notification from "./Components/notification";
import LoginForm from "./Components/login";

function App() {
    const [blogs, setBlogs] = useState();
    const [user, setUser] = useState();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [blogTitle, setBlogTitle] = useState("");
    const [blogAuthor, setBlogAuthor] = useState("");
    const [blogUrl, setBlogUrl] = useState("");
    const initialMessage = {
        content: "",
        type: null
    };
    const [message, setMessage] = useState(initialMessage);
    const [loginVisible, setLoginVisible] = useState(false);

    const handleLogin = async event => {
        event.preventDefault();
        try {
            const User = await loginService.login({ username, password });
            window.localStorage.setItem(
                "loggedBlogAppUser",
                JSON.stringify(User)
            );
            blogService.setToken(User.token);
            setUser(User);
            setUsername("");
            setPassword("");
            setMessage({
                type: "notice",
                content: `successfully logged in :)`
            });
            setTimeout(() => {
                setMessage(initialMessage);
            }, 3000);
        } catch (exception) {
            setMessage({
                type: "warning",
                content: `wrong username or password`
            });
            setTimeout(() => {
                setMessage(initialMessage);
            }, 3000);
        }
    };

    const handleLogout = () => {
        window.localStorage.removeItem("loggedBlogAppUser");
        setMessage({
            type: "notice",
            content: "successfully logged out :) will be redirected in 3 sec."
        });
        setTimeout(() => {
            setMessage(initialMessage);
            window.location.reload(true);
        }, 3000);
    };

    const createBlog = event => {
        event.preventDefault();
        const newBlogObject = {
            title: blogTitle,
            author: blogAuthor,
            url: blogUrl
        };
        blogService
            .createBlog(newBlogObject)
            .then(returnedBlog => {
                setBlogs(blogs.concat(returnedBlog));
                setBlogTitle("");
                setBlogAuthor("");
                setBlogUrl("");
                setMessage({
                    type: "notice",
                    content: `${blogTitle} by ${blogAuthor} added`
                });
                setTimeout(() => {
                    setMessage(initialMessage);
                }, 3000);
            })
            .catch(() => {
                setMessage({
                    type: "warning",
                    content: `post failed - blog title and author are mandatory field`
                });
                setTimeout(() => {
                    setMessage(initialMessage);
                }, 3000);
            });
    };

    const blogList = () => {
        const blogInfo =
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
        return (
            <>
                <div className="blogForm">
                    <h2>Create New</h2>
                    <form onSubmit={createBlog}>
                        <div className="blogFormItem">
                            <span>title </span>
                            <input
                                type="text"
                                value={blogTitle}
                                onChange={({ target }) =>
                                    setBlogTitle(target.value)
                                }
                                name="BlogTitle"
                            />
                        </div>
                        <div className="blogFormItem">
                            <span>author </span>
                            <input
                                type="text"
                                value={blogAuthor}
                                onChange={({ target }) =>
                                    setBlogAuthor(target.value)
                                }
                                name="BlogAuthor"
                            />
                        </div>
                        <div className="blogFormItem">
                            <span>url </span>
                            <input
                                type="text"
                                value={blogUrl}
                                onChange={({ target }) =>
                                    setBlogUrl(target.value)
                                }
                                name="BlogUrl"
                            />
                        </div>
                        <button type="submit">post</button>
                    </form>
                </div>
                <div className="blogList">
                    <h2>blogs</h2>
                    <p>
                        <b>{user.username}</b> logged in{" "}
                        <button onClick={handleLogout}>logout</button>
                    </p>
                    {blogInfo}
                </div>
            </>
        );
    };

    const handleUsernameChange = e => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = e => {
        setPassword(e.target.value);
    };

    const loginForm = () => {
        const hideWhenVisible = { display: loginVisible ? "none" : "" };
        const showWhenVisible = { display: loginVisible ? "" : "none" };

        return (
            <div>
                <div style={hideWhenVisible}>
                    <button onClick={() => setLoginVisible(true)}>
                        log in
                    </button>
                </div>
                <div style={showWhenVisible}>
                    <LoginForm
                        handleLogin={handleLogin}
                        username={username}
                        password={password}
                        handleUsernameChange={handleUsernameChange}
                        handlePasswordChange={handlePasswordChange}
                    />
                    <button onClick={() => setLoginVisible(false)}>
                        close
                    </button>
                </div>
            </div>
        );
    };
    useEffect(() => {
        blogService.getAll().then(returnedData => setBlogs(returnedData));
    }, []);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
        if (loggedUserJSON) {
            const User = JSON.parse(loggedUserJSON);
            setUser(User);
            blogService.setToken(User.token);
        }
    }, []);

    return (
        <div className="App">
            <div className="Container">
                <div className="Blog">
                    <h1>Blog Application</h1>
                    <Notification message={message} />
                    {user ? blogList() : loginForm()}
                </div>
            </div>
        </div>
    );
}

export default App;
