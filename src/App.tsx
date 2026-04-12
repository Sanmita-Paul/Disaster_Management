import { Routes, Route } from "react-router-dom";
import { Home } from "./home";
import { Login } from "./login";
import { Signup } from "./signup";
import { Dashboard } from "./Dashboards/dashboard";
import { NgoSetup } from "./ngosetup";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} /> 
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/ngo/setup" element={<NgoSetup/>}/>
    </Routes>
  );
}

export default App;