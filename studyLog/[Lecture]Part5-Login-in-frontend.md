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

