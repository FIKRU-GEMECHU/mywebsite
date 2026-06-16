import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";

import Admin from "./pages/Admin";
import AdminMessages from "./components/AdminMessages";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";
import Challenges from "./pages/Challenges";
import Goals from "./pages/Goals";
import BusinessPlan from "./pages/BusinessPlan";
import AIAnalysis from "./pages/AIAnalysis";

function App() {
  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />

            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/messages" element={<AdminMessages />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/business-plan" element={<BusinessPlan />} />
            <Route path="/ai-analysis" element={<AIAnalysis />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;