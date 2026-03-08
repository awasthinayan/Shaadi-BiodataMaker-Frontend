import { Routes, Route } from "react-router";
import ProtectedRoutes from "./Routes/ProtectedRoutes";
import Register from "./Pages/UserRegister";
import Login from "./Pages/UserLogin";
import Dashboard from "./Pages/Dashboard";
import Welcome from "./Pages/Welcome";
import CreateBiodata from "./Pages/BioData/Create.Biodata";
import PreviewBiodata from "./Pages/BioData/Preview.Biodata";
import Navbar from "./Components/Navbar";

const App = () => {
    return (
        <>
        <Navbar />
        <Routes>

            {/* 🔓 Public Routes */}
            <Route path="/" element={<Welcome />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* 🔐 Protected Routes */}
            <Route element={<ProtectedRoutes />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create"      element={<CreateBiodata />} />
                <Route path="/edit/:id"    element={<CreateBiodata />} />
                <Route path="/preview/:id" element={<PreviewBiodata />} />
            </Route>

        </Routes>
        </>
    );
};

export default App;