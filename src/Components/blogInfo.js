import React, { useState } from "react";

const BlogInfo = ({ blog, increaseLike }) => {
    const [blogVisible, setBlogVisible] = useState(false);

    const toggleVisible = () => {
        setBlogVisible(!blogVisible);
    };

    const handleLike = () => {
        const updatedBlogObject = {
            ...blog,
            likes: (blog.likes += 1)
        };
        increaseLike(blog.id, updatedBlogObject);
    };
    const showWhenVisible = { display: blogVisible ? "" : "none" };

    return (
        <div
            className="blogItem"
            style={{ marginBottom: "10px" }}
            key={blog.id}
        >
            <li>
                <b>{blog.title}</b> by {blog.author}{" "}
                <button onClick={toggleVisible}>
                    {blogVisible ? "view" : "hide"}
                </button>
            </li>
            <div style={showWhenVisible}>
                <li>url: {blog.url}</li>
                <li>
                    likes: {blog.likes}{" "}
                    <button onClick={handleLike}>like</button>
                </li>
                <li>user: {blog.user.username}</li>
            </div>
        </div>
    );
};

export default BlogInfo;
