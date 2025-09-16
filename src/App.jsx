import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import FarmerDetails from "@/components/pages/FarmerDetails";
import Farms from "@/components/pages/Farms";
import Tasks from "@/components/pages/Tasks";
import Weather from "@/components/pages/Weather";
import Finances from "@/components/pages/Finances";
import Dashboard from "@/components/pages/Dashboard";
import Crops from "@/components/pages/Crops";
import Settings from "@/components/pages/Settings";

// Pages
// Pages
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
<Route path="/farms" element={<Farms />} />
          <Route path="/crops" element={<Crops />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/finances" element={<Finances />} />
          <Route path="/farmers/:id" element={<FarmerDetails />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="toast-container"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;