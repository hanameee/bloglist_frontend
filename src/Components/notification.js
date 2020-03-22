import React from "react";
import "./notification.css";
function Notification({ message }) {
    const { content, type } = message;
    if (type === null) {
        return null;
    }
    return <div className={type}>{content}</div>;
}

export default Notification;
