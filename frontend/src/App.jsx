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

// Auth Layout - tanpa navbar
function AuthLayout({ children }) {
  return <>{children}</>;
}

// Protected Layout - dengan navbar
function LayoutWithNavbar({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Pages - tanpa navbar */}
        <Route path="/" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />

        {/* Protected Pages - dengan navbar */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <Dashboard />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <FileUpload />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <TransactionsTable />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <SuccessPage />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;