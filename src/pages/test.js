import React, { useState } from "react";
import Password from "../components/password";

export default function Blank() {
  const [password, setPassword] = useState("hello world");
  return (<>
    <div className="component">
      <div className="title">
        <h1 style={{color: "red"}}>Creating component :</h1>
      </div>
        <Password onPasswordTextChanged={setPassword}/>
        <p>Input value : {password}</p>
      <div>
      </div>
    </div>
  </>);
}
