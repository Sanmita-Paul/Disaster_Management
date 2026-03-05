import './login.css'

function Header_login(){
  return(
    <>
      <div className='head_login'>
        <img src="/logo.png" alt="logo" className="logo" />
        <h1>Disaster Management</h1>
      </div>
    </>
  )
}

import { useState } from "react";

function login_box(){

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      alert(data.message);

    } catch (error) {
      console.error("Error:", error);
      alert("Server error");
    }
  };

  return(
    <div className="login-box">
      <br></br>
      <h2>Login</h2>
      <br></br>

      <form onSubmit={handleSubmit}>

        <div className="user-box">
          <label className='email-box'>Email</label>&nbsp;&nbsp;
          <input 
            type="email" 
            name="email" 
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required 
          />
        </div>

        <div className="user-box">
          <label>Password</label>&nbsp;&nbsp;
          <input 
            type="password" 
            name="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required 
          />
        </div>

        <br></br>
        <button className="login-page-btn" type="submit">Submit</button>
      </form>
    </div>
  )
}export function Login() {
  return(
    <div className='login-body'>
      {Header_login()}
      {login_box()}
    </div>
  )
}