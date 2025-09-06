import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUpload from "./component/fileupload";
import SuccessPage from "./pages/anotherhome";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./component/Frame/Navbar";
import TransactionsTable from "./pages/transaction";
import Dashboard from "./pages/dashboard";
import Card from "./component/cards";
import Register from "./pages/register"
import Login from "./pages/login"


function App() {
  return (
    <Router>
      {/* <StickyNavbar /> */}
      <Navbar />
        <Routes>
          
        <Route path="/" element={<Login/>}/>
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/upload" element={<FileUpload />} />
        <Route path="/transactions" element={<TransactionsTable />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>

      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
