import React from "react";
import { Link } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiMenu, mdiClose } from "@mdi/js";

export default function Navbar() {
  const [open, setOpen] = React.useState(false);

  const link = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Transactions", path: "/transactions" },
    { name: "Upload", path: "/upload" },
  ];

  return (
    <div className="shadow-md w-full fixed bg-white top-0 left-0 z-50">
      <div className="flex items-center justify-between bg-white py-5 md:px-10 px-6">
        {/* Logo */}
        <div className="font-bold text-xl cursor-pointer flex items-center gap-2">
          <img
            src="./src/assets/images/logo-spil.png"
            className="w-[50px] h-[30px]"
            alt="logo"
          />
          Port Monitoring System
        </div>

        {/* Desktop Menu */}
        <ul className="navbar-desktop md:flex items-center gap-8 text-lg">
          {link.map((item) => (
            <li key={item.path} className="hover:text-blue-500">
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>

        {/* Mobile Icon */}
        <div
          onClick={() => setOpen(!open)}
          className="text-3xl cursor-pointer md:hidden"
        >
          <Icon path={open ? mdiClose : mdiMenu} size={1.2} />
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <ul className="md:hidden absolute bg-white w-full left-0 top-16 flex flex-col items-start gap-6 py-6 px-8 text-lg shadow-md transition-all duration-500 ease-in-out">
          {link.map((item) => (
            <li
              key={item.path}
              className="w-full hover:text-blue-500"
              onClick={() => setOpen(false)}
            >
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
