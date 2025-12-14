import { useLocation } from "react-router-dom";
import HomeNavbar from "./HomeNavbar";
import DefaultNavbar from "./DefaultNavbar";

const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return isHomePage ? <HomeNavbar /> : <DefaultNavbar />;
};

export default Navbar;
