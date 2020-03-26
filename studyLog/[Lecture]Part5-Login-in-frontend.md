# Part 5 - [Testing React apps](https://fullstackopen.com/en/part5)

---

## [a) Login in frontend](https://fullstackopen.com/en/part5/login_in_frontend)

우리의 note-app frontend 에 user management 기능을 추가할 것임.

### [복습] Form input 을 state로 관리하기

```react
const [username, setUsername] = useState('') 
const [password, setPassword] = useState('') 
// ...
<form onSubmit={handleLogin}>
  <div>
    username
    <input
      type="text"
      value={username}
      name="Username"
      onChange={({ target }) => setUsername(target.value)}
      />
  </div>
  <div>
    password
    <input
      type="password"
      value={password}
      name="Password"
      onChange={({ target }) => setPassword(target.value)}
      />
  </div>
  <button type="submit">login</button>
</form>
```

한가지 변경된 부분은 input 필드를 App의 state와 synchronize 하는 부분!

```js
({ target }) => setUsername(target.value)
```

위 이벤트 핸들러에서는 Object 를 파라미터로 받아, target 필드를 destructure 한 뒤 target의 value 값을 state 로 저장하는 것.

### 로그인 요청을 담당하는 ajax 코드 작성하기

`services/login.js`

async/await 문법 사용.

```js
import axios from "axios";
const baseURL = "api/login";

const login = async credentials => {
    const response = await axios.post(baseURL, credentials);
    return response.data;
};

export default { login };
```

`App.js`

```js
import loginService from "./Services/login";
//...
const [user, setUser] = useState(null);
//...
const handleLogin = async event => {
  event.preventDefault();
  try {
    //
    const User = await loginService.login({ username, password });
    setUser(User);
    setUsername("");
    setPassword("");
  } catch (exception) {
    setMessage({
      content: "Wrong credentials",
      type: "warning"
    });
    setTimeout(() => {
      setMessage(initialMessage);
    }, 5000);
  }
};
```

- login이 성공적이라면 - server response (아래 사진 참고 - 서버 응답은 토큰과 유저 디테일을 포함함) 가 user state에 저장되고, form field가 초기화된다.
  ![serverlogic](https://user-images.githubusercontent.com/25149664/76834938-6303ad80-6871-11ea-806d-649122edec64.png)
- login이 실패한다면 - catch 블록에서 에러를 잡아 에러 메세지를 뿜는다.

### 유저가 로그인 되어있을 때만 노트 작성 양식을 보여주기

user state 가 null 이라면 `user === null` 유저는 로그인 되어있지 않은 것임.

loginForm 과 noteForm 을 각각 별개의 컴포넌트로 분리한 뒤,

`App.js`

```react
const loginForm = () => (
  <form onSubmit={handleLogin}>
  <div>
  username{" "}
<input
type="text"
value={username}
name="Username"
onChange={({ target }) => {
  setUsername(target.value);
}}
autoComplete="false"
/>
  </div>
<div>
  password{" "}
<input
type="password"
value={password}
name="Password"
onChange={({ target }) => setPassword(target.value)}
/>
</div>
<button type="submit">login</button>
</form>
);

const noteForm = () => (
  <form onSubmit={addNote}>
  <input value={newNote} onChange={handleNoteChange} />
    <button type="submit">save</button>
</form>
);
```

삼항연산자를 이용해 user 정보가 있다면 noteForm을, 없다면 loginForm 을 보여주도록 함.

`App.js`

```react
<div className="Wrapper">
  {user === null ? (
    loginForm()
  ) : (
    <div>
    <p>{user.name} logged in</p>
    {noteForm()}
    </div>
  )}
</div>
```

### 노트 create request 전송 시 token도 함께 전송시키기

백엔드 API 를 바꾸며, create 요청 시 valid한 token 도 함께 요구된다. 따라서 프론트에서도 note POST 요청을 보낼 때 token을 함께 보내도록 수정해야 한다.

`services/noteService`

```js
import axios from 'axios'
const baseURL = "/api/notes"

let token = null
const setToken = newToken => {
  token = `bearer ${newToken}`
}

// ...

const create = async newObject => {
  const config = {
    headers: {Authorization: token},
  }
  // post 메서드의 3번째 인자로 token이 담긴 header을 넘겨준다
  const response = await axios.post(baseURL, newObject, config)
}

export default { getAll, create, update, setToken }
```

`App.js`

```js
const handleLogin = async (event) => {
  event.preventDefault()
  try {
    const User = await loginService.login({
      username, password,
    })
    // 로그인 후 돌아온 user 객체의 토큰을 setToken으로 변환해 가지고 있는다 
    noteService.setToken(User.token)
    // ...
}
```

### token을 브라우저의 local storage에 저장하기

지금은 token을 state에 저장해두었기 때문에 새로고침하면 state가 초기화되어 로그인 정보가 날아가버린다.

key-value 로 구성된 브라우저의 데이터베이스인 [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage)에 로그인 정보를 저장함으로써 이 문제를 해결할 수 있다.

```js
// local storage에 저장하기 (DOMstrings로 저장되어야 함. Object 자료형 저장 불가능하기에 JSON.stringfy 해야함)
window.localStorage.setItem("loggedNoteappUser",JSON.stringify(User))
// local storage에서 가져오기 (String 형태기에 Object로 가져오기 위해서는 JSON.parse 해야함)
window.localStorage.getItem("loggedNoteappUser")
// local storage에서 삭제하기
window.localStorage.removeItem("loggedNoteappUser")
```

페이지에 새로 진입했을 때, local storage에 로그인 된 유저정보가 있는지 체크해야 함. 이 작업은 **effect hook** 으로 할 수 있다.

`App.js`

```react
// 맨 처음 렌더링 될 때에만 실행되도록
useEffect(()=> {
  const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    setUser(user)
    noteService.setToken(user.token)
  }
},[])
```

---
## [b) props.children and proptypes](https://fullstackopen.com/en/part5/props_children_and_proptypes)

#### The components children, aka. props.children

버튼을 눌렀을 때에만 form이 보이도록 하고 싶다면?

Togglable 컴포넌트를 작성한다.

```react
import React, { useState } from "react";

const Togglable = props => {
    const [visible, setVisible] = useState(false);

    const hideWhenVisible = { display: visible ? "none" : "" };
    const showWhenVisible = { display: visible ? "" : "none" };

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                {props.children}
                <button onClick={toggleVisibility}>cancel</button>
            </div>
        </div>
    );
};

export default Togglable;
```

Togglable 하게 만들고 싶은 컴포넌트를 Togglable 로 감싸준다.

```react
<Togglable buttonLabel="create new note">
    <NoteForm
  addNote={addNote}
  newNote={newNote}
  handleNoteChange={handleNoteChange}
  />
  </Togglable>
```

`props.children` 은 React에 의해 항상 추가되는 prop 이다.
Togglable에서 props.children 은 Togglable 안에 감싸진 component인 NoteForm이 된다.

#### State of the forms

현재는 App.js에서 모든 state가 관리되고 있다.

```react
// ...
const App = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [showAll, setShowAll] = useState(true);
    const initialMessage = {
        content: "",
        type: null
    };
    const [message, setMessage] = useState(initialMessage);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
// ...
```

그런데, [React document](https://reactjs.org/docs/lifting-state-up.html) 에서는 state의 관리 위치에 대해 아래와 같이 말하고 있다.

> Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor.

NoteForm 의 state (생성되기 전 입력된 note 정보와 같은 경우) 는 App에서 알고 있을 필요가 없다. 그냥 NoteForm 에서 알아서 관리해도 된다.

`components/NoteForm`

```react
import React, { useState } from "react";

const NoteForm = ({ createNote }) => {
    const [newNote, setNewNote] = useState("");
    const handleNoteChange = event => {
        setNewNote(event.target.value);
    };
  	// ajax 요청을 보내는 createNote 함수만 prop으로 받고, 그 외 note state와 관련된 부분은 NoteForm에서 처리한다.
    const addNote = event => {
        event.preventDefault();
        createNote({
            content: newNote,
            date: new Date().toISOString(),
            important: Math.random() > 0.5
        });
        setNewNote("");
    };
    return (
        <form onSubmit={addNote}>
            <input value={newNote} onChange={handleNoteChange} />
            <button type="submit">save</button>
        </form>
    );
};

export default NoteForm;
```

`App.js`

App.js에는 handleNoteChange, newNoted의 useState, addNote 는 다 삭제하고 오로지 ajax 요청을 한 뒤 notes 상태를 갱신하는 `createNote` 함수만 놔둔다.

```react
const createNote = noteObject => {
  noteService.create(noteObject).then(returnedNote => {
    setNotes(notes.concat(returnedNote));
  });
};
```

이 함수를 NoteState 컴포넌트에 전달해줘서 NoteState에서 새롭게 만든 객체로 POST 요청을 보낼 수 있게!

#### References to components with ref

[참고 링크]([https://velog.io/@marvin-j/React-ref-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0](https://velog.io/@marvin-j/React-ref-사용하기))

새로운 노트를 생성하는 즉시 noteForm 이 Toggle 되는 기능을 구현해보자.
이 기능을 구현할 때 문제점이 하나 있는데, 새로운 노트를 생성하는 함수 `createNote`는 App 컴포넌트에서 관리하고 Togglable div가 닫히는 함수 `toggleVisibility` 는 Togglable 컴포넌트에서 관리한다는 점.

하위 컴포넌트의 함수인 `toggleVisibility` 를 상위 컴포넌트인 App 에서 접근하기 위해서는 `ref` 기능을 사용할 수 있다.

1. 상위 컴포넌트에서 ref를 생성해 하위 컴포넌트에게 전달

```react
const App = () => {
  // ...
  const noteFormRef = React.createRef()

  const noteForm = () => (
    <Togglable buttonLabel='new note' ref={noteFormRef}>
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  // ...
```

2. 하위 컴포넌트를 `forwardRef` hook 으로 감싸고, useImperativeHandle hook로 상위 컴포넌트에게 전달하고 싶은 친구들을 콜백함수로 리턴

```react
import React, { useState, useImperativeHandle } from "react";

// 전체 컴포넌트를 forwardRef hook으로 감싼다
const Togglable = React.forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);

    const hideWhenVisible = { display: visible ? "none" : "" };
    const showWhenVisible = { display: visible ? "" : "none" };

    const toggleVisibility = () => {
        setVisible(!visible);
    };
  
  	// 콜백함수로 toggleVisibility 를 넘겨준다
    useImperativeHandle(ref, () => {
        return { toggleVisibility };
    });

    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                {props.children}
                <button onClick={toggleVisibility}>cancel</button>
            </div>
        </div>
    );
});

export default Togglable;
```

3. 상위 컴포넌트에서 `ref이름.current.원하는친구` 로 접근 가능

```react
const createNote = noteObject => {
  // 이렇게 접근할 수 있지요
  noteFormRef.current.toggleVisibility();
  noteService.create(noteObject).then(returnedNote => {
    setNotes(notes.concat(returnedNote));
  });
};
```

