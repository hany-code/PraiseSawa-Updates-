import React, { useState } from "react";
import Footer from "./components/Footer";
import Home from "./components/Home";
import AboutUs from "./components/AboutUs";
import Support from "./components/Support";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFound from "./components/NotFound";
import Categories from "./components/Categories";
import SongDetail from "./components/SongDetail";
import Songs from "./components/Songs";
import Sidebar from "./components/Sidebar";
import PlankPage from "./components/PlankPage";
import Events from "./components/Events";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <div className="gradient" />
        <div className="z-10 font-sans text-gray-800 bg-transparent flex-1 relative">
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <main
            className={`transition-all duration-300 ${isSidebarOpen
              ? "lg:ml-64 ml-0" // When sidebar is open
              : "lg:ml-16 ml-0"  // When sidebar is closed
              }`}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/aboutUs" element={<AboutUs />} />
              <Route path="categories" element={<Categories />} />
              <Route path="songs" element={<Songs />} />
              <Route path="songs/:id" element={<SongDetail />} />
              <Route path="PlankPage" element={<PlankPage />} />
              <Route path="support" element={<Support />} />
              <Route path="events" element={<Events />} />

              {/* <Route path="Popular" element={<PlankPage />} /> */}
              {/* <Route path="library" element={<PlankPage />} /> */}
              {/* <Route path="products" element={<PlankPage />} /> */}
              {/* <Route path="services" element={<PlankPage />} /> */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
        <div className={`transition-all duration-300 ${isSidebarOpen
          ? "lg:ml-64 ml-0" // When sidebar is open
          : "lg:ml-16 ml-0"  // When sidebar is closed
          }`}>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;