import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { toast } from "react-toastify";
import Icon from "@mdi/react";
import { MdMail } from "react-icons/md";
import { mdiMenu, mdiClose, mdiServerNetwork } from "@mdi/js";
import { MdSupervisedUserCircle } from 'react-icons/md';

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

  // Ambil user + data profile saat komponen mount
  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error.message);
        } else {
          setProfileName(data?.name || "");
        }
      }
    };

    fetchUserAndProfile();

    // Subscribe ke perubahan auth state
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session); // Debug auth state
        setUser(session?.user ?? null);
        if (session?.user) {
          supabase
            .from("profiles")
            .select("name")
            .eq("id", session.user.id)
            .single()
            .then(({ data, error }) => {
              if (error) {
                console.error("Error fetching profile on auth change:", error.message);
              } else {
                setProfileName(data?.name || "");
              }
            });
        } else {
          setProfileName("");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const link = [
    { name: "Upload", path: "/upload" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Transactions", path: "/transactions" },
  ];

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Logout failed: " + error.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.error("Logout error:", error.message);
        return;
      }

      toast.success("Successfully logged out!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Wait for session to clear and toast to show
      setTimeout(() => {
        navigate("/login");
      }, 2500);
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
          <img
            src="./src/assets/images/logo-spil.png"
            className="w-[50px] h-[30px]"
            alt="logo"
          />
          Port Monitoring System
        </div>
        <div className="navbar-desktop md:flex items-center gap-2 text-lg">
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
                      {profileName
                        ? profileName[0].toUpperCase()
                        : user?.email
                        ? user.email[0].toUpperCase()
                        : "U"}
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
                    <span>{user?.email}</span>
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
            {profileName || user?.email || "User"}
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
        </ul>
      )}
    </div>
  );
}