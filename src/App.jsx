import { HashRouter, Routes, Route } from "react-router-dom";
import Startup from "./components/Startup";
import SelectClothScreen from "./components/SelectClothScreen";
import SelectClothTypeScreen from "./components/SelectClothTypeScreen";
import CameraSection from "./components/CameraSection";
import FinalPreviewScreen from "./components/FinalPreviewScreen";
import Login from "./components/SuperAdmin/Login";
import { Toaster } from "react-hot-toast";
import Dashboard from "./components/SuperAdmin/Dashboard/Dashboard";
import ProtectedSARoutes from "./routes/ProtectedSARoutes";
import ClientDashboard from "./components/Admin/Dashboard/ClientDashboard";
import ProtectedClientRoutes from "./routes/ProtectedClientRoutes";


export default function App() {
  return (
    <HashRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Startup />} />
        <Route path="/select-cloth" element={<SelectClothScreen />} />
        <Route
          path="/select-cloth-type/:clothId"
          element={<SelectClothTypeScreen />}
        />
        <Route path="/camera" element={<CameraSection />} />
        <Route path="/final" element={<FinalPreviewScreen />} />

        {/*  ===========================  Super Admin Side  ========================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/sa/dashboard" element={<ProtectedSARoutes><Dashboard /></ProtectedSARoutes>} />


           {/*  =========================== Admin Side  ========================= */}
        <Route path="/client/dashboard" element={<ProtectedClientRoutes>
          <ClientDashboard />
        </ProtectedClientRoutes>} />
      </Routes>
    </HashRouter>
  );
}
