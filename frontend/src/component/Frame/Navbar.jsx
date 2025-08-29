/* PAGE NAVBAR MANUAL PERTAMA LANCAR AMAN TAPI HARUS MAKE <NAVBAR /> DI APP,JSX */
import React from "react";
import { Link } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiServerNetwork } from "@mdi/js";


export default function Navbar() {
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
            {/* <Link to="/admin" className="hover:text-gray-300">
              Admin Panel
            </Link> */}
          </div>

          {/* Profile */}
          {/* <div className="flex items-center space-x-2">
            <span className="hidden sm:block">admin</span>
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              Admin
            </span>
          </div> */}
        </div>
      </div>
    </nav>
  );
}

// /* PAGE NAVBAR OTOMATIS TEMPLATE PERTAMA LANCAR TAPI HARUS CUSTOM <NAVBAR /> DI APP,JSX */
// // import { useState } from "react";

// // export default function Navbar() {
// //   const [isOpen, setIsOpen] = useState(false);

// //   return (
// //     <nav className="relative flex items-center justify-between sm:h-10 md:justify-center py-6 px-4 mt-2">
// //       {/* Logo + Toggle Button */}
// //       <div className="flex items-center flex-1 md:absolute md:inset-y-0 md:left-0">
// //         <div className="flex items-center justify-between w-full md:w-auto">
// //           <a href="/" aria-label="Home">
// //             <img
// //               src="https://www.svgrepo.com/show/491978/gas-costs.svg"
// //               height="40"
// //               width="40"
// //               alt="Logo"
// //             />
// //           </a>
// //           {/* Mobile Menu Button */}
// //           <div className="-mr-2 flex items-center md:hidden">
// //             <button
// //               type="button"
// //               aria-label="Main menu"
// //               aria-haspopup="true"
// //               onClick={() => setIsOpen(!isOpen)}
// //               className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 
// //                          hover:text-gray-500 hover:bg-gray-100 focus:outline-none 
// //                          focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
// //             >
// //               <svg
// //                 stroke="currentColor"
// //                 fill="none"
// //                 viewBox="0 0 24 24"
// //                 className="h-6 w-6"
// //               >
// //                 <path
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   strokeWidth="2"
// //                   d={
// //                     isOpen
// //                       ? "M6 18L18 6M6 6l12 12" // "X" icon
// //                       : "M4 6h16M4 12h16M4 18h16" // hamburger
// //                   }
// //                 />
// //               </svg>
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Navigation Links */}
// //       <div className="flex space-x-10">
// //         <a
// //           href="#features"
// //           className="font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
// //         >
// //           Features
// //         </a>
// //         <a
// //           href="#pricing"
// //           className="font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
// //         >
// //           Pricing
// //         </a>
// //         <a
// //           href="/blog"
// //           className="font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
// //         >
// //           Blog
// //         </a>
// //         <a
// //           href="https://docs.pingping.io"
// //           target="_blank"
// //           rel="noreferrer"
// //           className="font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
// //         >
// //           Docs
// //         </a>
// //       </div>

// //       {/* Right Buttons */}
// //       <div className="hidden md:absolute md:flex md:items-center md:justify-end md:inset-y-0 md:right-0">
// //         <span className="inline-flex">
// //           <a
// //             href="/login"
// //             className="inline-flex items-center px-4 py-2 border border-transparent text-base 
// //                        leading-6 font-medium text-blue-600 hover:text-blue-500 
// //                        focus:outline-none transition duration-150 ease-in-out"
// //           >
// //             Login
// //           </a>
// //         </span>
// //         <span className="inline-flex rounded-md shadow ml-2">
// //           <a
// //             href="/signup"
// //             className="inline-flex items-center px-4 py-2 border border-transparent text-base 
// //                        leading-6 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 
// //                        focus:outline-none focus:border-blue-700 transition duration-150 ease-in-out"
// //           >
// //             Get started
// //           </a>
// //         </span>
// //       </div>

// //       {/* Mobile Dropdown */}
// //       {isOpen && (
// //         <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden">
// //           <div className="flex flex-col space-y-2 p-4">
// //             <a href="#features" className="text-gray-700">
// //               Features
// //             </a>
// //             <a href="#pricing" className="text-gray-700">
// //               Pricing
// //             </a>
// //             <a href="/blog" className="text-gray-700">
// //               Blog
// //             </a>
// //             <a href="https://docs.pingping.io" target="_blank" rel="noreferrer" className="text-gray-700">
// //               Docs
// //             </a>
// //             <a href="/login" className="text-blue-600">
// //               Login
// //             </a>
// //             <a href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md">
// //               Get started
// //             </a>
// //           </div>
// //         </div>
// //       )}
// //     </nav>
// //   );
// // }

// /**PAGE TRIAL KETIGA/*
// // import React from "react";
// // import { Link } from "react-router-dom";
// // import {
// //   Navbar,
// //   MobileNav,
// //   Typography,
// //   Button,
// //   Menu,
// //   MenuHandler,
// //   MenuList,
// //   MenuItem,
// //   Avatar,
// //   Card,
// //   IconButton,
// // } from "@material-tailwind/react";
// // import {
// //   CubeTransparentIcon,
// //   UserCircleIcon,
// //   CodeBracketSquareIcon,
// //   Square3Stack3DIcon,
// //   ChevronDownIcon,
// //   Cog6ToothIcon,
// //   InboxArrowDownIcon,
// //   LifebuoyIcon,
// //   PowerIcon,
// //   RocketLaunchIcon,
// //   Bars2Icon,
// // } from "@heroicons/react/24/solid";
 
// // // profile menu component
// // const profileMenuItems = [
// //   {
// //     label: "My Profile",
// //     icon: UserCircleIcon,
// //   },
// //   {
// //     label: "Edit Profile",
// //     icon: Cog6ToothIcon,
// //   },
// //   {
// //     label: "Inbox",
// //     icon: InboxArrowDownIcon,
// //   },
// //   {
// //     label: "Help",
// //     icon: LifebuoyIcon,
// //   },
// //   {
// //     label: "Sign Out",
// //     icon: PowerIcon,
// //   },
// // ];
 
// // function ProfileMenu() {
// //   const [isMenuOpen, setIsMenuOpen] = React.useState(false);
 
// //   const closeMenu = () => setIsMenuOpen(false);
 
// //   return (
// //     <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
// //       <MenuHandler>
// //         <Button
// //           variant="text"
// //           color="blue-gray"
// //           className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
// //         >
// //           <Avatar
// //             variant="circular"
// //             size="sm"
// //             alt="tania andrew"
// //             className="border border-gray-900 p-0.5"
// //             src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
// //           />
// //           <ChevronDownIcon
// //             strokeWidth={2.5}
// //             className={`h-3 w-3 transition-transform ${
// //               isMenuOpen ? "rotate-180" : ""
// //             }`}
// //           />
// //         </Button>
// //       </MenuHandler>
// //       <MenuList className="p-1">
// //         {profileMenuItems.map(({ label, icon }, key) => {
// //           const isLastItem = key === profileMenuItems.length - 1;
// //           return (
// //             <MenuItem
// //               key={label}
// //               onClick={closeMenu}
// //               className={`flex items-center gap-2 rounded ${
// //                 isLastItem
// //                   ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
// //                   : ""
// //               }`}
// //             >
// //               {React.createElement(icon, {
// //                 className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
// //                 strokeWidth: 2,
// //               })}
// //               <Typography
// //                 as="span"
// //                 variant="small"
// //                 className="font-normal"
// //                 color={isLastItem ? "red" : "inherit"}
// //               >
// //                 {label}
// //               </Typography>
// //             </MenuItem>
// //           );
// //         })}
// //       </MenuList>
// //     </Menu>
// //   );
// // }
 
// // // nav list menu
// // const navListMenuItems = [
// //   {
// //     title: "@material-tailwind/html",
// //     description:
// //       "Learn how to use @material-tailwind/html, packed with rich components and widgets.",
// //   },
// //   {
// //     title: "@material-tailwind/react",
// //     description:
// //       "Learn how to use @material-tailwind/react, packed with rich components for React.",
// //   },
// //   {
// //     title: "Material Tailwind PRO",
// //     description:
// //       "A complete set of UI Elements for building faster websites in less time.",
// //   },
// // ];
 
// // function NavListMenu() {
// //   const [isMenuOpen, setIsMenuOpen] = React.useState(false);
 
// //   const renderItems = navListMenuItems.map(({ title, description }) => (
// //     <a href="#" key={title}>
// //       <MenuItem>
// //         <Typography variant="h6" color="blue-gray" className="mb-1">
// //           {title}
// //         </Typography>
// //         <Typography variant="small" color="gray" className="font-normal">
// //           {description}
// //         </Typography>
// //       </MenuItem>
// //     </a>
// //   ));
 
// //   return (
// //     <React.Fragment>
// //       <Menu allowHover open={isMenuOpen} handler={setIsMenuOpen}>
// //         <MenuHandler>
// //           <Typography as="a" href="#" variant="small" className="font-normal">
// //             <MenuItem className="hidden items-center gap-2 font-medium text-blue-gray-900 lg:flex lg:rounded-full">
// //               <Square3Stack3DIcon className="h-[18px] w-[18px] text-blue-gray-500" />{" "}
// //               Pages{" "}
// //               <ChevronDownIcon
// //                 strokeWidth={2}
// //                 className={`h-3 w-3 transition-transform ${
// //                   isMenuOpen ? "rotate-180" : ""
// //                 }`}
// //               />
// //             </MenuItem>
// //           </Typography>
// //         </MenuHandler>
// //         <MenuList className="hidden w-[36rem] grid-cols-7 gap-3 overflow-visible lg:grid">
// //           <Card
// //             color="blue"
// //             shadow={false}
// //             variant="gradient"
// //             className="col-span-3 grid h-full w-full place-items-center rounded-md"
// //           >
// //             <RocketLaunchIcon strokeWidth={1} className="h-28 w-28" />
// //           </Card>
// //           <ul className="col-span-4 flex w-full flex-col gap-1">
// //             {renderItems}
// //           </ul>
// //         </MenuList>
// //       </Menu>
// //       <MenuItem className="flex items-center gap-2 font-medium text-blue-gray-900 lg:hidden">
// //         <Square3Stack3DIcon className="h-[18px] w-[18px] text-blue-gray-500" />{" "}
// //         Pages{" "}
// //       </MenuItem>
// //       <ul className="ml-6 flex w-full flex-col gap-1 lg:hidden">
// //         {renderItems}
// //       </ul>
// //     </React.Fragment>
// //   );
// // }
 
// // // nav list component
// // const navListItems = [
// //   {
// //     label: "Account",
// //     icon: UserCircleIcon,
// //   },
// //   {
// //     label: "Blocks",
// //     icon: CubeTransparentIcon,
// //   },
// //   {
// //     label: "Docs",
// //     icon: CodeBracketSquareIcon,
// //   },
// // ];
 
// // function NavList() {
// //   return (
// //     <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
// //       <NavListMenu />
// //       {navListItems.map(({ label, icon }, key) => (
// //         <Typography
// //           key={label}
// //           as="a"
// //           href="#"
// //           variant="small"
// //           color="gray"
// //           className="font-medium text-blue-gray-500"
// //         >
// //           <MenuItem className="flex items-center gap-2 lg:rounded-full">
// //             {React.createElement(icon, { className: "h-[18px] w-[18px]" })}{" "}
// //             <span className="text-gray-900"> {label}</span>
// //           </MenuItem>
// //         </Typography>
// //       ))}
// //     </ul>
// //   );
// // }
 
// // export function ComplexNavbar() {
// //   const [isNavOpen, setIsNavOpen] = React.useState(false);
 
// //   const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);
 
// //   React.useEffect(() => {
// //     window.addEventListener(
// //       "resize",
// //       () => window.innerWidth >= 960 && setIsNavOpen(false),
// //     );
// //   }, []);
 
// //   return (
// //     <Navbar className="mx-auto max-w-screen-xl p-2 lg:rounded-full lg:pl-6">
// //       <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">
// //         <Typography
// //           as="a"
// //           href="#"
// //           className="mr-4 ml-2 cursor-pointer py-1.5 font-medium"
// //         >
// //           Material Tailwind
// //         </Typography>
// //         <div className="hidden lg:block">
// //           <NavList />
// //         </div>
// //         <IconButton
// //           size="sm"
// //           color="blue-gray"
// //           variant="text"
// //           onClick={toggleIsNavOpen}
// //           className="ml-auto mr-2 lg:hidden"
// //         >
// //           <Bars2Icon className="h-6 w-6" />
// //         </IconButton>
 
// //         <Button size="sm" variant="text">
// //           <span>Log In</span>
// //         </Button>
// //         <ProfileMenu />
// //       </div>
// //       <MobileNav open={isNavOpen} className="overflow-scroll">
// //         <NavList />
// //       </MobileNav>
// //     </Navbar>
// //   );
// // }

/* PAGE NAVBAR OTOMATIS TEMPLATE KEDUA LANCAR AMAN TAPI HARUS CUSTOM <NAVBAR /> DI APP,JSX */
// import React from "react";
// import {
//   Navbar,
//   MobileNav,
//   Typography,
//   Button,
//   IconButton,
// } from "@material-tailwind/react";
// import { Link } from "react-router-dom";

// export function StickyNavbar() {
//   const [openNav, setOpenNav] = React.useState(false);

//   React.useEffect(() => {
//     const handleResize = () => window.innerWidth >= 960 && setOpenNav(false);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const navList = (
//     <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
//       <Typography as="li" variant="small" color="blue-gray" className="p-1 font-normal">
//         <Link to="/" className="flex items-center">Dashboard</Link>
//       </Typography>
//       <Typography as="li" variant="small" color="blue-gray" className="p-1 font-normal">
//         <Link to="/upload" className="flex items-center">Upload Data</Link>
//       </Typography>
//       <Typography as="li" variant="small" color="blue-gray" className="p-1 font-normal">
//         <Link to="/transactions" className="flex items-center">View Transactions</Link>
//       </Typography>
//     </ul>
//   );

//   return (
//     <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4">
//       <div className="flex items-center justify-between text-blue-gray-900">
//         {/* Logo & Title */}
//         <Typography as={Link} to="/" className="mr-4 cursor-pointer py-1.5 font-bold">
//           Port Monitoring System
//         </Typography>

//         <div className="flex items-center gap-4">
//           {/* Desktop Menu */}
//           <div className="mr-4 hidden lg:block">{navList}</div>

//           {/* Right side buttons */}
//           <div className="flex items-center gap-x-1">
//             <Button variant="text" size="sm" className="hidden lg:inline-block">
//               <span>Log In</span>
//             </Button>
//             <Button variant="gradient" size="sm" className="hidden lg:inline-block">
//               <span>Sign Up</span>
//             </Button>
//           </div>

//           {/* Mobile Menu Button */}
//           <IconButton
//             variant="text"
//             className="ml-auto h-6 w-6 text-inherit hover:bg-transparent 
//                        focus:bg-transparent active:bg-transparent lg:hidden"
//             ripple={false}
//             onClick={() => setOpenNav(!openNav)}
//           >
//             {openNav ? (
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="h-6 w-6"
//                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
//               </svg>
//             ) : (
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"
//                    fill="none" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
//               </svg>
//             )}
//           </IconButton>
//         </div>
//       </div>

//       {/* Mobile Nav Dropdown */}
//       <MobileNav open={openNav}>
//         {navList}
//         <div className="flex items-center gap-x-1">
//           <Button fullWidth variant="text" size="sm">
//             <span>Log In</span>
//           </Button>
//           <Button fullWidth variant="gradient" size="sm">
//             <span>Sign Up</span>
//           </Button>
//         </div>
//       </MobileNav>
//     </Navbar>
//   );
// }
// export default StickyNavbar;