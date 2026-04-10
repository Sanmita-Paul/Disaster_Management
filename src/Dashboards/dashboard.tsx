import AdminDashboard from "./admin/AdminDashboard";
import NGODashboard from "./ngo/NGODashboard";
import VolunteerDashboard from "./volunteer/VolunteerDashboard";
import UserDashboard from "./user/UserDashboard";

export function Dashboard() {

  const role = localStorage.getItem("role")?.trim().toLowerCase();

  if (role === "admin") return <AdminDashboard />;
  if (role === "ngo") return <NGODashboard />;
  if (role === "volunteer") return <VolunteerDashboard />;
  if (role === "user") return <UserDashboard />;

  return <h1>No role found</h1>;
}