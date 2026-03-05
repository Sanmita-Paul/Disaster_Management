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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();
      alert(data.message);

    } catch (error) {
      console.error("Error:", error);
      alert("Server error");
    }
  };

  return(
    <>
    <div className="signup-box">
      <br></br>
      <h2 className="heading">Sign Up</h2>

      {/* ✅ Only change here */}
      <form onSubmit={handleSubmit}>

        <label className="name">Name</label>
        <input 
          type="text" 
          placeholder="Enter Name" 
          value={name}
          onChange={(e)=>setName(e.target.value)}
          required 
        />
        <br></br>

        <label className="email">Email</label>
        <input 
          type="email" 
          placeholder="Enter Email" 
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required 
        />
        <br></br>

        <label className="password">Password</label>
        <input 
          type="password" 
          placeholder="Enter Password" 
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required 
        />
        <br></br>

        <label className="confirm_password">Confirm Password</label>
         <div className="show_password">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              required
            />
            <button  
              className="show-btn"
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
            >
            {showPassword ? "🙈" : "🐵"}
            </button>
          </div>

        <label className="role">Role</label>
        <select 
          value={role}
          onChange={(e)=>setRole(e.target.value)}
          required
        >
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