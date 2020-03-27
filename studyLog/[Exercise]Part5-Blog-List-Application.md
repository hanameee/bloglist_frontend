# [Exercises] Part 5 - [Blog List Application](https://fullstackopen.com/en/part4)

---

## 5.7) Togglable BlogPost 구현

`components/blogInfo`

BlogInfo를 별도의 컴포넌트로 분리한다.

```react
import React, { useState } from "react";

const BlogInfo = ({ blog }) => {
  	// 각각의 BlogInfo 컴포넌트 
    const [blogVisible, setBlogVisible] = useState(false);

    const toggleVisible = () => {
        setBlogVisible(!blogVisible);
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
                    likes: {blog.likes} <button>like</button>
                </li>
                <li>user: {blog.user.username}</li>
            </div>
        </div>
    );
};

export default BlogInfo;
```

`App.js`

App.js 에서 아래와 같이 가져다 쓰면 됨!

```react
const blogList = () => {
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
        <BlogInfo blog={blog} key={blog.id} />
      ))}
    </div>
      </>
    );
```

## 5.9) blogList 가 좋아요 순으로 정렬되게 하기

`sort` 메소드에 compareFunction 을 지정해줌으로써 구현할 수 있다. [참고 링크](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)

```react
const blogList = () => {
  blogs && blogs.sort((a, b) => (a.likes > b.likes ? -1 : 1));
  return (
```

