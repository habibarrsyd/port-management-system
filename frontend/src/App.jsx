import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUpload from "./component/fileupload";
import SuccessPage from "./pages/anotherhome";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./component/Frame/Navbar";
import TransactionsTable from "./pages/transaction";
import Dashboard from "./pages/dashboard";


function App() {
  return (
    <Router>
      {/* <StickyNavbar /> */}
      <Navbar />
        <Routes>
          
        <Route path="/" element={<FileUpload/>}/>
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/upload" element={<FileUpload />} />
        <Route path="/transactions" element={<TransactionsTable />} />
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
