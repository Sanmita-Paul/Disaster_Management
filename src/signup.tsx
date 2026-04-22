import "./signup.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header_signup(){
  return(
    <div className='head_login'>
      <img src="/logo.png" alt="logo" className="logo" />
      <h1>Disaster Management</h1>
    </div>
  )
}

function Signup_box(){
  const navigate = useNavigate();

  // COMMON STATES
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // VOLUNTEER STATES
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [location, setLocation] = useState<any>(null);

  // FILES
  const [idFile, setIdFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        alert("Geolocation not supported");
        reject(null);
      } else {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            };
            setLocation(coords);
            resolve(coords);
          },
          () => {
            alert("Please allow location access");
            reject(null);
          }
        );
      }
    });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // ✅ USE FORMDATA (IMPORTANT)
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);

      if (role === "volunteer") {

        if (!location) {
          try {
            await getLocation();
          } catch {
            alert("Location is required");
            return;
          }
        }

        formData.append("age", age);
        formData.append("gender", gender);
        formData.append("aadhaar_number", aadhar);

        // ✅ send lat/lng separately
        formData.append("latitude", location.lat);
        formData.append("longitude", location.lng);

        // ✅ FILES
        if (idFile) formData.append("id_proof", idFile);
        if (imageFile) formData.append("image", imageFile);
      }

      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        body: formData // ❌ no JSON headers
      });

      const data = await response.json();
      alert(data.message);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", data.user.role);
      }

      if (role === "ngo") {
        navigate("/ngo/setup");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Server error");
    }
  };

  return(
    <div className="signup-box">
      <h2 className="heading">Sign Up</h2>

      <form onSubmit={handleSubmit}>

        <label>Name</label>
        <input 
          type="text" 
          placeholder="Enter Name" 
          value={name}
          onChange={(e)=>setName(e.target.value)}
          required 
        />

        <label>Email</label>
        <input 
          type="email" 
          placeholder="Enter Email" 
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required 
        />

        <label>Password</label>
        <input 
          type="password" 
          placeholder="Enter Password" 
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required 
        />

        <label>Confirm Password</label>
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

        <label>Role</label>
        <select 
          value={role}
          onChange={(e)=>{
            const selectedRole = e.target.value;
            setRole(selectedRole);

            if (selectedRole === "volunteer") {
              getLocation();
            }
          }}
          required
        >
          <option value="">Select Role</option>
          <option value="admin">Admin👨‍💼</option>
          <option value="user">User👥</option>
          <option value="ngo">NGO🏛️</option>
          <option value="volunteer">Volunteer🦺</option>
        </select>

        {role === "volunteer" && (
          <>
            {!location && (
              <p style={{ color: "yellow", fontSize: "14px" }}>
                📍 Location will be requested
              </p>
            )}

            <label>Age</label>
            <input 
              value={age} 
              onChange={(e)=>setAge(e.target.value)} 
              required 
            />

            <label>Gender</label>
            <select 
              value={gender} 
              onChange={(e)=>setGender(e.target.value)} 
              required
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <label>Aadhar No.</label>
            <input 
              value={aadhar} 
              onChange={(e)=>setAadhar(e.target.value)} 
              required 
            />

            <label>Upload ID Proof</label>
            <input 
              type="file" 
              onChange={(e)=>setIdFile(e.target.files?.[0] || null)} 
            />

            <label>Upload Profile Image</label>
            <input 
              type="file" 
              onChange={(e)=>setImageFile(e.target.files?.[0] || null)} 
            />
          </>
        )}

        <button className="btn" type="submit">Submit</button>
      </form>
    </div>
  )
}

export function Signup(){
  return(
    <div className="signup-body">
      <Header_signup />
      <div className="signup-container">
        <Signup_box />
      </div>
    </div>
  )
}