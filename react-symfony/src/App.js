import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Components
// import Nav from "./components/Navbar/Nav";

// import Views
import Register from "./views/Register/register";
import Login from "./views/Login/Login";
import Home from "./views/Home/Home";
import Dashboard from "./views/Dashboard/dashboard";
const App = () => {
  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        {/* <Register/> */}

      </BrowserRouter>
    </>
  );
};

export default App;
