import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
// import { Features } from "./Features"

function Layout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Outlet />
      {/* <Features /> */}
    </div>
  );
}

export default Layout;
