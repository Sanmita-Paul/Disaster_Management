import "./signup.css";
import { useState } from "react";
function Header_signup(){
  return(
    <>
      <div className='head_login'>
        <img src="/logo.png" alt="logo" className="logo" />
        <h1>Disaster Management</h1>
      </div>
    </>
  )
}
function signup_box(){
  const [showPassword, setShowPassword] = useState(false);
  return(
    <>
    <div className="signup-box">
      <br></br>
      <h2 className="heading">Sign Up</h2>
      <form>
        <label className="name">Name</label>
        <input type="text" placeholder="Enter Name" required />
        <br></br>
        <label className="email">Email</label>
        <input type="email" placeholder="Enter Email" required />
        <br></br>
        <label className="password">Password</label>
        <input type="password" placeholder="Enter Password" required />
        <br></br>
        <label className="confirm_password">Confirm Password</label>
         <div className="show_password">
            <input type={showPassword ? "text" : "password"} placeholder="Confirm Password"/>
            <button  className="show-btn"type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "🐵"}
            </button>
          </div>
        <label className="role">Role</label>
        <select required>
          <option value="">Select Role</option>
          <option value="admin">Admin👨‍💼</option>
          <option value="user">User👥</option>
          <option value="ngo">NGO🏛️</option>
          <option value="volunteer">Volunteer🦺</option>
        </select>
        <br></br>
        <button className="btn" type="submit">Submit</button>
      </form>
    </div>
    </>
  )
}
export function Signup(){
  return(
    <div className="signup-body">
      {Header_signup()}
      {signup_box()}
    </div>
  )
}