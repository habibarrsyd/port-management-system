import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import FileUpload from "./component/fileupload";
import SuccessPage from "./pages/anotherhome";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./component/Frame/Navbar";
import TransactionsTable from "./pages/transaction";
import Dashboard from "./pages/dashboard";
import Register from "./pages/register";
import Login from "./pages/login";
import ProtectedRoute from "./component/protectedroute";
import { supabase } from "./supabaseClient";
// import logout from "./pages/logout";

function LayoutWithNavbar({ children }) {
  const location = useLocation();

  // sembunyikan navbar di /login dan /register
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

function App() {
  return (
    <Router>
      <LayoutWithNavbar>
        <Routes>
          {/* Auth Pages */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Pages */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <FileUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <TransactionsTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <SuccessPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </LayoutWithNavbar>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
