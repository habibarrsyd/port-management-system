import React from "react";
import { Link } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiServerNetwork } from "@mdi/js";
import { Bars3Icon } from "@heroicons/react/16/solid";


export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-red-300 text-white w-full sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center ml-[10px]">
            <img 
              src="./src/assets/images/logo-spil.png"
              alt="logo"
              className="w-[50px] h-[30px] mt-[5px]"
            />
            {/* <Icon path={mdiServerNetwork} size={1} className="text-blue-600" /> */}
            <span className=" font-bold ml-[15px]">
              Port Monitoring System
            </span>
          </div>


          {/* Menu links */}
          <div className="flex space-x-10 ml-auto">
            <Link to="/" className="hover:text-gray-300 ">
              Home
            </Link>
            <Link to="/dashboard" className="text-white hover:text-gray-30 ">
              Dashboard
            </Link>
            <Link to="/transactions" className="text-white hover:text-gray-300 ">
              Transaction
            </Link>
            <Link to="/upload" className="text-white hover:text-gray-300 ">
              Upload
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="hamburger-menu">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? (
                <Bars3Icon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}