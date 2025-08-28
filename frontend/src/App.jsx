import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUpload from "./component/fileupload";
import SuccessPage from "./pages/anotherhome";
// import Nav from "./component/Frame/Navbar";
// import Header from "./component/header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./component/Frame/Navbar";
// import { ComplexNavbar } from "./component/Frame/Navbar";
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import ComplexNavbar  from "./component/Frame/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
        <Routes>
          
        <Route path="/" element={<FileUpload/>}/>
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </Router>
  );
}

export default App;
