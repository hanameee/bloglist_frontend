import React, { useState } from "react";

const LoginForm = ({ handleLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleUsernameChange = e => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = e => {
        setPassword(e.target.value);
    };

    const handleLoginForm = event => {
        event.preventDefault();
        setUsername("");
        setPassword("");
        handleLogin({ username, password });
    };

    return (
        <form onSubmit={handleLoginForm}>
            <h2>Login</h2>
            <div>
                username:
                <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                />
            </div>
            <div>
                password:
                <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                />
            </div>
            <button type="submit">login</button>
        </form>
    );
};

export default LoginForm;
