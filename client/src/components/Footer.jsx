import React from "react";
import logo from "../assets/images/praise sawa  (1).svg";
import LineMark from "../assets/images/LineMark.svg";
import ArrowRight from "../assets/images/ArrowRight.svg";
import earth from "../assets/images/earth.svg";
import email from "../assets/images/email.svg";
import { useNavigate } from "react-router-dom";

const Footer = ({ marginLeft }) => {
  const navigate = useNavigate();

  const NavLink = ({ to, children }) => (
    <div
      className="cursor-pointer flex items-center gap-2 transition-all duration-200 group"
      onClick={() => navigate(to)}
    >
      <img 
        src={ArrowRight} 
        alt="arrow" 
        className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" 
      />
      <div className="text-sm md:text-base hover:bg-gradient-to-r hover:from-amber-500 hover:via-orange-600 hover:to-yellow-500 hover:bg-clip-text hover:text-transparent">
        {children}
      </div>
    </div>
  );

  const SocialLink = ({ href, icon, name }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 flex justify-center items-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors duration-200 cursor-pointer"
    >
      <img src={icon} alt={name} className="w-5 h-5" />
    </a>
  );

  return (
    <footer className="w-full py-8 md:py-12 transition-all duration-300 bg-white mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Logo and Social Links Section */}
          <div className="flex flex-col">
            <img 
              src={logo} 
              alt="Praise Sawa Logo" 
              className="w-48 md:w-60 h-auto cursor-pointer" 
              onClick={() => navigate("/")} 
            />
            <div className="flex gap-4 mt-6">
              {/* Social links can be uncommented when needed */}
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="flex flex-col gap-4 mt-4 md:mt-8">
            <div className="font-bold text-base md:text-base mb-2">Quick Links</div>
            <img src={LineMark} alt="line" className="w-8 md:w-10 mb-3" />
            <div className="flex flex-col gap-3">
              <NavLink to="/">Home</NavLink>
              {/* Additional NavLinks can be added here */}
            </div>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col gap-4 mt-4 md:mt-8">
            <div className="font-bold text-base md:text-base mb-2">Contact</div>
            <img src={LineMark} alt="line" className="w-8 md:w-10 mb-3" />
            <div className="flex flex-col gap-3">
              <a
                href="mailto:Info@praisesawa.org"
                className="flex items-center gap-3 transition-all duration-200 group"
              >
                <img 
                  src={earth} 
                  alt="earth" 
                  className="w-5 h-5 transition-transform duration-200 group-hover:rotate-12" 
                />
                <span className="text-sm md:text-base group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:via-orange-600 group-hover:to-yellow-500 group-hover:bg-clip-text group-hover:text-transparent">
                  Info@praisesawa.org
                </span>
              </a>
            </div>
          </div>

          {/* Empty fourth column for layout balance in large screens */}
          <div className="lg:block hidden">
            {/* This space is intentionally left empty */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;