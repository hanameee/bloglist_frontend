import React, { useState, useEffect } from "react";

import "./App.css";
import blogService from "./Services/blogs";
import loginService from "./Services/login";
import Notification from "./Components/notification";
import Togglable from "./Components/togglable";
import LoginForm from "./Components/loginForm";
import BlogInfo from "./Components/blogInfo";
import BlogForm from "./Components/blogForm";

function App() {
    const [blogs, setBlogs] = useState();
    const [user, setUser] = useState();
    const initialMessage = {
        content: "",
        type: null
    };
    const [message, setMessage] = useState(initialMessage);

    const blogFormRef = React.createRef();

    const handleLogin = async ({ username, password }) => {
        try {
            const User = await loginService.login({ username, password });
            window.localStorage.setItem(
                "loggedBlogAppUser",
                JSON.stringify(User)
            );
            blogService.setToken(User.token);
            setUser(User);

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

    const createBlog = newBlogObject => {
        blogFormRef.current.toggleVisiblity();
        blogService
            .createBlog(newBlogObject)
            .then(returnedBlog => {
                setBlogs(blogs.concat(returnedBlog));
                setMessage({
                    type: "notice",
                    content: `${returnedBlog.title} by ${returnedBlog.author} added`
                });
                setTimeout(() => {
                    setMessage(initialMessage);
                }, 3000);
            })
            .catch(() => {
                setMessage({
                    type: "warning",
                    content: `post failed - blog title and author are mandatory fields`
                });
                setTimeout(() => {
                    setMessage(initialMessage);
                }, 3000);
            });
    };

    const removeBlog = id => {
        blogService
            .removeBlog(id)
            .then(response => setBlogs(blogs.filter(blog => blog.id !== id)))
            .catch(error => {
                setMessage({
                    type: "warning",
                    content: `remove failed - you can only remove blog posted by you`
                });
                setTimeout(() => {
                    setMessage(initialMessage);
                }, 3000);
            });
    };

    const increaseLike = (id, updateBlogObject) => {
        blogService
            .increaseLike(id, updateBlogObject)
            .then(returnedBlog => {
                setBlogs(
                    blogs.filter(blog => (blog.id === id ? returnedBlog : blog))
                );
            })
            .catch(exception => console.log(exception));
    };

    const blogList = () => {
        blogs && blogs.sort((a, b) => (a.likes > b.likes ? -1 : 1));
        return (
            <>
                {blogForm()}
                <div className="blogList">
                    <h2>blogs</h2>
                    <p>
                        <b>{user.username}</b> logged in{" "}
                        <button onClick={handleLogout}>logout</button>
                    </p>
                    {blogs &&
                        blogs.map(blog => (
                            <BlogInfo
                                key={blog.id}
                                blog={blog}
                                user={user}
                                increaseLike={increaseLike}
                                removeBlog={removeBlog}
                            />
                        ))}
                </div>
            </>
        );
    };

    const loginForm = () => {
        return (
            <Togglable openLabel="log in">
                <LoginForm handleLogin={handleLogin} />
            </Togglable>
        );
    };

    const blogForm = () => {
        return (
            <Togglable openLabel="create new blog" ref={blogFormRef}>
                <BlogForm createBlog={createBlog} />
            </Togglable>
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
