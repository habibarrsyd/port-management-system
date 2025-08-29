import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUpload from "./component/fileupload";
import SuccessPage from "./pages/anotherhome";
// import Nav from "./component/Frame/Navbar";
// import Header from "./component/header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./component/Frame/Navbar";
import TransactionsTable from "./pages/transaction";
// import { StickyNavbar } from "./component/Frame/Navbar";
// import { ComplexNavbar } from "./component/Frame/Navbar";
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import ComplexNavbar  from "./component/Frame/Navbar";

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

      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import FileUpload from "./component/fileupload";
// import SuccessPage from "./pages/anotherhome";
// import { StickyNavbar } from "./component/Frame/Navbar";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function App() {
//   return (
//     <Router>
//       <StickyNavbar />
//       <Routes>
//         <Route path="/" element={<FileUpload />} />
//         <Route path="/upload" element={<FileUpload />} />
//         <Route path="/transactions" element={<SuccessPage />} />
//       </Routes>
//       <ToastContainer position="top-center" autoClose={3000} />
//     </Router>
//   );
// }

// export default App;

