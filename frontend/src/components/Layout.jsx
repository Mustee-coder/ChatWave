import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="h-screen flex overflow-hidden">
      {showSidebar && <Sidebar />}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
export default Layout;