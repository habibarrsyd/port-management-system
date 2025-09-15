import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProtectedRoute({ children }) {
  const userId = localStorage.getItem("user_id");

  if (!userId) {
    toast.error("You must be logged in to access this page!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    return <Navigate to="/login" replace />;
  }

  return children;
}