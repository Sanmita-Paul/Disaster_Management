import { useState } from "react";
import Sidebar from "./Sidebar";
import HomePage from "./HomePage";
import ReportForm from "./ReportForm";
import Nearby from "./Nearby";
import Alerts from "./Alerts";
import Status from "./Status";
import Contacts from "./Contacts";
import "./dashboard.css";

function Header_login(){
  return(
    <>
      <div className='head_welcome'>
        <img src="/logo.png" alt="logo" className="logo" />
        <h1>Disaster Management</h1>
      </div>
    </>
  )
}
const UserDashboard: React.FC = () => {

  const [page, setPage] = useState("home");

 const renderPage = () => {
  switch (page) {
    case "home":
      return <HomePage />;
    case "report":
      return <ReportForm />;
    case "nearby":
      return <Nearby />;
    case "alerts":
      return <Alerts />;
    case "status":
      return <Status />;
    case "contacts":
      return <Contacts />;
    default:
      return <HomePage />;
  }
};
  return (
  <div>
    <Header_login />

    <div className="dashboard-container">
      <Sidebar setPage={setPage} />

      <div className="dashboard-content">
        {renderPage()}
      </div>
    </div>
  </div>
);
};

export default UserDashboard;