import React, { useState, forwardRef, useImperativeHandle } from "react";

const Togglable = forwardRef((props, ref) => {
    const [loginVisible, setLoginVisible] = useState(false);

    const hideWhenVisible = { display: loginVisible ? "none" : "" };
    const showWhenVisible = { display: loginVisible ? "" : "none" };

    const toggleVisiblity = () => {
        setLoginVisible(!loginVisible);
    };

    useImperativeHandle(ref, () => {
        return { toggleVisiblity };
    });

    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={() => toggleVisiblity()}>{props.label}</button>
            </div>
            <div style={showWhenVisible}>
                {props.children}
                <button onClick={() => toggleVisiblity()}>close</button>
            </div>
        </div>
    );
});

export default Togglable;
