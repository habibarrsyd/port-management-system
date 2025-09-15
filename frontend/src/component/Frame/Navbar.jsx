import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Icon from "@mdi/react";
import { MdMail } from "react-icons/md";
import { mdiMenu, mdiClose, mdiServerNetwork } from "@mdi/js";
import { MdSupervisedUserCircle } from "react-icons/md";

const Dropdown = ({ id, buttonContent, menuContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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
        className={`absolute right-0 mt-2 min-w-fit max-w-xs bg-white shadow-lg rounded-md border border-gray-200 py-1 z-50 ${
          isOpen ? "block" : "hidden"
        }`}
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
  const [user, setUser] = useState(null);
  const [profileName, setProfileName] = useState("");
  const navigate = useNavigate();

  // Fetch user profile from Flask backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        setUser(null);
        setProfileName("");
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/profile?user_id=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setUser({
          user_id: data.user_id,
          name: data.name,
          email: data.email,
        });
        setProfileName(data.name || "");
      } catch (error) {
        console.error("Error fetching profile:", error.message);
        setUser(null);
        setProfileName("");
        toast.error("Failed to fetch profile data.");
      }
    };

    fetchUserProfile();
  }, []);
  const link = [
    { name: "Upload", path: "/upload" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Transactions", path: "/transactions" },
  ];

  const handleLogout = async () => {
  try {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      // Call the logout endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
    }

    // Remove user_id from localStorage
    localStorage.removeItem("user_id");
    // Remove token if JWT is implemented
    // localStorage.removeItem("token");

    toast.success("Successfully logged out!", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    // Wait for toast to show
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  } catch (err) {
    toast.error("Unexpected error during logout: " + err.message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    console.error("Unexpected logout error:", err.message);
  }
};

  return (
    <div className="shadow-md w-full fixed bg-white top-0 left-0 z-10">
      <div className="flex items-center justify-between bg-white py-4 md:px-8 px-6">
        <div className="font-bold text-xl cursor-pointer flex items-center gap-2">
          <img src={`${import.meta.env.BASE_URL}images/logo-spil.png`} className="w-[50px] h-[30px]" alt="logo" />

          Port Monitoring System
        </div>
        <div className="navbar-desktop md:flex items-center gap-2 text-lg">
          {user ? (
            <>
              <ul className="flex items-center gap-4">
                {link.map((item) => (
                  <li key={item.path} className="hover:text-blue-500">
                    <Link to={item.path}>{item.name}</Link>
                  </li>
                ))}
              </ul>
              <div className="ml-3">
                <Dropdown
                  id="avatar-dropdown"
                  buttonContent={
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content w-8 rounded-full ring-3 ring-gray-800 flex items-center justify-center">
                        <span className="text-md font-extrabold">
                          {profileName ? profileName[0].toUpperCase() : "U"}
                        </span>
                      </div>
                    </div>
                  }
                  menuContent={
                    <>
                      <li className="bg-white px-3 py-2 text-[#353333] font-medium rounded-md flex items-center">
                        <MdSupervisedUserCircle className="inline mr-1 text-red-800 w-4 h-4 flex-shrink-0" />
                        <span>{profileName || "User"}</span>
                      </li>
                      <li className="bg-white px-3 py-2 text-xs text-gray-600 rounded-md flex items-center">
                        <MdMail className="inline mr-1 text-red-800 w-4 h-4 flex-shrink-0" />
                        <span>{user?.email || "No email"}</span>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="flex items-center px-3 py-2 gap-1 text-red-800 hover:bg-red-100 w-full text-left"
                        >
                          <Icon path={mdiServerNetwork} size={0.6} className="text-red-800" />
                          Logout
                        </button>
                      </li>
                    </>
                  }
                />
              </div>
            </>
          ) : (
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          )}
        </div>
        <div
          onClick={() => setOpen(!open)}
          className="text-3xl cursor-pointer md:hidden"
        >
          <Icon path={open ? mdiClose : mdiMenu} size={1.2} />
        </div>
      </div>
      {open && (
        <ul className="md:hidden absolute bg-white w-full left-0 top-10 flex flex-col items-start gap-3 py-4 px-8 text-lg shadow-md transition-all duration-500 ease-in-out">
          {user ? (
            <>
              {link.map((item) => (
                <li
                  key={item.path}
                  className="w-full hover:text-blue-500"
                  onClick={() => setOpen(false)}
                >
                  <Link to={item.path}>{item.name}</Link>
                </li>
              ))}
              <li className="w-full px-3 py-1 text-[#353333] font-medium">
                {profileName || "User"}
              </li>
              <li className="w-full text-red-500 hover:text-blue-500">
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1 font-medium hover:bg-gray-100 w-full text-left"
                >
                  <Icon
                    path={mdiServerNetwork}
                    size={0.8}
                    className="text-red-500"
                  />
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li className="w-full hover:text-blue-500">
              <Link to="/login" onClick={() => setOpen(false)}>
                Login
              </Link>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}