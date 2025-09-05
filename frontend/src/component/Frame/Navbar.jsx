import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiMenu, mdiClose, mdiServerNetwork } from "@mdi/js";

const Dropdown = ({ id, buttonContent, menuContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-flex" ref={dropdownRef}>
      <div
        id={id}
        className="cursor-pointer"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Dropdown"
        onClick={() => setIsOpen(!isOpen)}
      >
        {buttonContent}
      </div>
      <ul
        className={`absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border border-gray-200 py-1 z-50 ${isOpen ? 'block' : 'hidden'}`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby={id}
      >
        {menuContent}
      </ul>
    </div>
  );
};

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const link = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Transactions", path: "/transactions" },
    { name: "Upload", path: "/upload" },
    
  ];

  return (
    <div className="shadow-md w-full fixed bg-white top-0 left-0 z-10">
      <div className="flex items-center justify-between bg-white py-2 md:px-8 px-6">
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
        <div className="navbar-desktop md:flex items-center gap-2 text-lg">
          <ul className="flex items-center gap-4">
            {link.map((item) => (
              <li key={item.path} className="hover:text-blue-500">
                <Link to={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
          <div className="ml-3">
            <Dropdown className = ""
              id="avatar-dropdown"
              buttonContent={
                <div className="avatar size-7 rounded-full overflow-hidden mt-2">
                    <img
                      src="https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png"
                      alt="avatar"
                    />
                </div>
              }
              menuContent={
                <>
                  <li>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-3 py-1 text-[#353333] hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon path={mdiServerNetwork} size={0.8} className="text-blue-600" />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-3 py-1 text-[#353333] hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon path={mdiServerNetwork} size={0.8} className="text-blue-600" />
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      className="flex items-center gap-2 px-3 py-1 text-red-500 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon path={mdiServerNetwork} size={0.8} className="text-red-500" />
                      Logout
                    </Link>
                  </li>
                </>
              }
            />
          </div>
        </div>

        {/* Mobile Hamburger Icon */}
        <div
          onClick={() => setOpen(!open)}
          className="text-3xl cursor-pointer md:hidden"
        >
          <Icon path={open ? mdiClose : mdiMenu} size={1.2} />
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <ul className="md:hidden absolute bg-white w-full left-0 top-10 flex flex-col items-start gap-3 py-4 px-8 text-lg shadow-md transition-all duration-500 ease-in-out">
          {link.map((item) => (
            <li
              key={item.path}
              className="w-full hover:text-blue-500"
              onClick={() => setOpen(false)}
            >
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
          <li className="w-full hover:text-blue-500">
            <Link to="/profile" onClick={() => setOpen(false)}>
              Profile
            </Link>
          </li>
          <li className="w-full hover:text-blue-500">
            <Link to="/settings" onClick={() => setOpen(false)}>
              Settings
            </Link>
          </li>
          <li className="w-full text-red-500 hover:text-blue-500">
            <Link to="/logout" onClick={() => setOpen(false)}>
              Logout
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}