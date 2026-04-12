import './login.css'
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header_login(){
  return(
    <div className='head_login'>
      <img src="/logo.png" alt="logo" className="logo" />
      <h1>Disaster Management</h1>
    </div>
  )
}

function Login_box(){
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (data.user && data.user.role) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", data.user.role);

        alert("Login successful");

       
          navigate("/dashboard");
        // ✅ END

      } else {
        alert(data.message || "Login failed");
      }

      setLoading(false);

    } catch (error) {
      console.error("Error:", error);
      alert("Server error");
      setLoading(false);
    }
  };

  return(
    <div className="login-box">
      <br />
      <h2>Login</h2>
      <br />

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

        <br />

        <button 
          className="login-page-btn" 
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Submit"}
        </button>

      </form>
    </div>
  )
}

export function Login() {
  return(
    <div className='login-body'>
      <Header_login />
      <div className="login-container">
        <Login_box />
      </div>
    </div>
  )
}