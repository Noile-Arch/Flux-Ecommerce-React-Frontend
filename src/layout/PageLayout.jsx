import { ToastContainer } from "react-toastify";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
const PageLayout = () => {
  return (
    <>
      <div className="w-full h-auto">
        <nav className="w-full h-20 absolute ">
          <Navbar />
        </nav>
        <div className="w-full h-auto">
          <ToastContainer />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default PageLayout;
