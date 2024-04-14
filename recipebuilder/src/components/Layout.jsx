import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Toaster } from "react-hot-toast";

const Layout = () => {
  return (
    <main className="App">
      <Header />
      <Toaster />
      <Outlet />
    </main>
  );
};

export default Layout;
