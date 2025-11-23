// // src/components/NavbarSidebar.jsx
// import { useState, useEffect } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   LogOut,
//   Home,
//   Code,
//   FileText,
//   MessageSquare,
//   User,
//   Settings,
//   Sun,
//   Moon,
//   Grid,
// } from "lucide-react";
// import { logoutUser } from "../authSlice";
// import axiosClient from "../utils/axiosClient";

// /**
//  * NOTE: developer-uploaded file path (used as logo url per your instruction)
//  * You can replace this with an actual image path from your extracted front.zip assets.
//  */
// const logoUrl = "/mnt/data/front.zip";

// function ThemeToggle() {
//   const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

//   useEffect(() => {
//     if (theme === "dark") document.documentElement.classList.add("dark");
//     else document.documentElement.classList.remove("dark");
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   return (
//     <button
//       onClick={() => setTheme(theme === "light" ? "dark" : "light")}
//       className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:opacity-90 transition"
//       aria-label="Toggle theme"
//     >
//       {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
//     </button>
//   );
// }

// export default function NavbarSidebar({ children }) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth || {});
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     // Auto-hide sidebar on small screens
//     const handleResize = () => {
//       setSidebarOpen(window.innerWidth >= 1024);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const handleLogout = async () => {
//     try {
//       // optional call to backend logout endpoint (if you have one)
//       await axiosClient.post("/user/logout").catch(() => {});
//     } catch (err) {
//       // ignore backend logout error
//     } finally {
//       dispatch(logoutUser());
//       navigate("/login");
//     }
//   };

//   const navItems = [
//     { to: "/", label: "Home", icon: <Home size={18} /> },
//     { to: "/problems", label: "Problems", icon: <Code size={18} /> },
//     { to: "/submissions", label: "Submissions", icon: <FileText size={18} /> },
//     { to: "/ai", label: "AI Chat", icon: <MessageSquare size={18} /> },
//     // Admin shown separately based on role
//   ];

//   return (
//     <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
//       {/* SIDEBAR - desktop */}
//       <aside
//         className={`hidden lg:flex lg:flex-col w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 transition-all ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-64"
//         }`}
//       >
//         <div className="px-6 py-5 flex items-center gap-3 border-b dark:border-gray-700">
//           <img
//             src={logoUrl}
//             alt="logo"
//             className="w-10 h-10 object-contain rounded-md bg-gray-100 dark:bg-gray-700"
//           />
//           <div>
//             <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
//               LeetCode
//             </div>
//             <div className="text-xs text-gray-500 dark:text-gray-400">
//               Practice & Learn
//             </div>
//           </div>
//         </div>

//         <nav className="flex-1 px-3 py-6 overflow-auto">
//           <ul className="space-y-1">
//             {navItems.map((item) => (
//               <li key={item.to}>
//                 <NavLink
//                   to={item.to}
//                   className={({ isActive }) =>
//                     `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
//                       isActive
//                         ? "bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-white"
//                         : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
//                     }`
//                   }
//                 >
//                   <span className="text-gray-500 dark:text-gray-300">
//                     {item.icon}
//                   </span>
//                   <span>{item.label}</span>
//                 </NavLink>
//               </li>
//             ))}

//             {user?.role === "admin" && (
//               <li>
//                 <NavLink
//                   to="/admin"
//                   className={({ isActive }) =>
//                     `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
//                       isActive
//                         ? "bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-white"
//                         : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
//                     }`
//                   }
//                 >
//                   <span className="text-gray-500 dark:text-gray-300">
//                     <Grid size={18} />
//                   </span>
//                   <span>Admin</span>
//                 </NavLink>
//               </li>
//             )}
//           </ul>
//         </nav>

//         <div className="px-4 py-4 border-t dark:border-gray-700">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-semibold">
//               {user?.firstName?.charAt(0)?.toUpperCase() || <User size={18} />}
//             </div>
//             <div className="flex-1">
//               <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
//                 {user?.firstName || "Guest"}
//               </div>
//               <div className="text-xs text-gray-500 dark:text-gray-400">
//                 {user?.email || ""}
//               </div>
//             </div>
//             <button
//               onClick={handleLogout}
//               title="Logout"
//               className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//             >
//               <LogOut size={18} />
//             </button>
//           </div>
//         </div>
//       </aside>

//       {/* MOBILE SIDEBAR (drawer) */}
//       <div
//         className={`fixed inset-0 z-40 lg:hidden ${
//           mobileOpen ? "block" : "hidden"
//         }`}
//       >
//         <div
//           className="absolute inset-0 bg-black/40"
//           onClick={() => setMobileOpen(false)}
//         />
//         <div className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-800 shadow-xl border-r dark:border-gray-700">
//           <div className="px-6 py-5 flex items-center gap-3 border-b dark:border-gray-700">
//             <img
//               src={logoUrl}
//               alt="logo"
//               className="w-10 h-10 object-contain rounded-md bg-gray-100 dark:bg-gray-700"
//             />
//             <div>
//               <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
//                 LeetCode
//               </div>
//               <div className="text-xs text-gray-500 dark:text-gray-400">
//                 Practice & Learn
//               </div>
//             </div>
//           </div>

//           <nav className="px-3 py-6">
//             <ul className="space-y-1">
//               {navItems.map((item) => (
//                 <li key={item.to}>
//                   <NavLink
//                     to={item.to}
//                     onClick={() => setMobileOpen(false)}
//                     className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
//                   >
//                     <span className="text-gray-500 dark:text-gray-300">
//                       {item.icon}
//                     </span>
//                     <span>{item.label}</span>
//                   </NavLink>
//                 </li>
//               ))}

//               {user?.role === "admin" && (
//                 <li>
//                   <NavLink
//                     to="/admin"
//                     onClick={() => setMobileOpen(false)}
//                     className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
//                   >
//                     <span className="text-gray-500 dark:text-gray-300">
//                       <Grid size={18} />
//                     </span>
//                     <span>Admin</span>
//                   </NavLink>
//                 </li>
//               )}
//             </ul>
//           </nav>

//           <div className="px-4 py-4 border-t dark:border-gray-700">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-semibold">
//                 {user?.firstName?.charAt(0)?.toUpperCase() || (
//                   <User size={18} />
//                 )}
//               </div>
//               <div className="flex-1">
//                 <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
//                   {user?.firstName || "Guest"}
//                 </div>
//                 <div className="text-xs text-gray-500 dark:text-gray-400">
//                   {user?.email || ""}
//                 </div>
//               </div>
//               <button
//                 onClick={() => {
//                   setMobileOpen(false);
//                   handleLogout();
//                 }}
//                 title="Logout"
//                 className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 <LogOut size={18} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* MAIN CONTENT */}
//       <div className="flex-1 flex flex-col">
//         {/* TOP NAVBAR */}
//         <header className="w-full bg-white dark:bg-gray-900 border-b dark:border-gray-700 sticky top-0 z-30">
//           <div className="container mx-auto px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
//             <div className="flex items-center gap-3">
//               {/* Mobile hamburger */}
//               <button
//                 onClick={() => setMobileOpen(true)}
//                 className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5 text-gray-700 dark:text-gray-200"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 6h16M4 12h16M4 18h16"
//                   />
//                 </svg>
//               </button>

//               {/* Sidebar collapse */}
//               <button
//                 onClick={() => setSidebarOpen((s) => !s)}
//                 className="hidden lg:inline-flex p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
//                 title="Toggle sidebar"
//               >
//                 <Grid size={18} className="text-gray-700 dark:text-gray-200" />
//               </button>

//               {/* Search */}
//               <div className="relative">
//                 <input
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder="Search problems, tags..."
//                   className="input input-bordered h-10 w-72 pr-10 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
//                 />
//                 <button className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-md text-gray-500 dark:text-gray-300">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-4 w-4"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <ThemeToggle />

//               <div className="hidden md:flex items-center gap-3">
//                 <button
//                   className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
//                   title="Notifications"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5 text-gray-700 dark:text-gray-200"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//                     />
//                   </svg>
//                 </button>

//                 {/* user dropdown (small) */}
//                 <div className="dropdown dropdown-end">
//                   <button
//                     tabIndex={0}
//                     className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
//                   >
//                     <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-semibold">
//                       {user?.firstName?.charAt(0)?.toUpperCase() || (
//                         <User size={16} />
//                       )}
//                     </div>
//                     <div className="text-sm hidden sm:block">
//                       {user?.firstName || "Guest"}
//                     </div>
//                   </button>
//                   <ul
//                     tabIndex={0}
//                     className="menu dropdown-content p-2 shadow bg-white dark:bg-gray-800 rounded-box w-52"
//                   >
//                     <li>
//                       <NavLink to="/profile">Profile</NavLink>
//                     </li>
//                     <li>
//                       <NavLink to="/settings">Settings</NavLink>
//                     </li>
//                     <li>
//                       <button onClick={handleLogout}>Logout</button>
//                     </li>
//                   </ul>
//                 </div>
//               </div>

//               {/* small screens: show only avatar */}
//               <div className="md:hidden">
//                 <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
//                   <div className="w-6 h-6 text-xs text-white bg-indigo-600 rounded-full flex items-center justify-center">
//                     {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
//                   </div>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* PAGE CONTENT */}
//         <main className="flex-1 overflow-auto p-6">{children}</main>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Moon, Sun } from "lucide-react";
import { logoutUser } from "../authSlice";

export default function NavbarSidebar({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [open, setOpen] = useState(false);

  // Theme Handling
  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/problems", label: "Problems" },
    { to: "/submissions", label: "Submissions" },
    { to: "/ai", label: "AI Chat" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static z-40 top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-5 transition-transform ${
          open ? "translate-x-0" : "-translate-x-64 lg:translate-x-0"
        }`}
      >
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-8">
          LeetCode
        </h1>

        {/* NAV LINKS */}
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md font-medium ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}

          {/* ADMIN ONLY */}
          {user?.role === "admin" && (
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md font-medium ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`
                }
              >
                Admin Panel
              </NavLink>
            </li>
          )}
        </ul>

        {/* USER SECTION */}
        <div className="absolute bottom-5 left-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-semibold">
            {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-semibold">{user?.firstName}</p>
            <button
              onClick={() => dispatch(logoutUser())}
              className="text-sm text-red-500 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* NAVBAR */}
        <nav className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          {/* Mobile Sidebar Button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Menu />
          </button>

          <h2 className="text-xl font-semibold">Dashboard</h2>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded"
          >
            {theme === "light" ? <Moon /> : <Sun />}
          </button>
        </nav>

        {/* PAGE CONTENT */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
