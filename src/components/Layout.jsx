import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
// import { Features } from "./Features"

function Layout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Outlet />
      {/* <Features /> */}
      <Footer />
    </div>
  );
}

export default Layout;
