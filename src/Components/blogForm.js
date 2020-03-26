import React, { useState } from "react";

const BlogForm = ({ createBlog }) => {
    const [blogTitle, setBlogTitle] = useState("");
    const [blogAuthor, setBlogAuthor] = useState("");
    const [blogUrl, setBlogUrl] = useState("");
    const addBlog = event => {
        event.preventDefault();
        createBlog({
            title: blogTitle,
            author: blogAuthor,
            url: blogUrl
        });
        setBlogTitle("");
        setBlogAuthor("");
        setBlogUrl("");
    };
    return (
        <div className="blogForm">
            <h2>Create New</h2>
            <form onSubmit={addBlog}>
                <div className="blogFormItem">
                    <span>title </span>
                    <input
                        type="text"
                        value={blogTitle}
                        onChange={({ target }) => setBlogTitle(target.value)}
                        name="BlogTitle"
                    />
                </div>
                <div className="blogFormItem">
                    <span>author </span>
                    <input
                        type="text"
                        value={blogAuthor}
                        onChange={({ target }) => setBlogAuthor(target.value)}
                        name="BlogAuthor"
                    />
                </div>
                <div className="blogFormItem">
                    <span>url </span>
                    <input
                        type="text"
                        value={blogUrl}
                        onChange={({ target }) => setBlogUrl(target.value)}
                        name="BlogUrl"
                    />
                </div>
                <button type="submit" style={{ float: "left" }}>
                    create
                </button>
            </form>
        </div>
    );
};

export default BlogForm;
