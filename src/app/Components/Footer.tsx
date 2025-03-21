import React from "react";

const Footer = () => {
  return (
    <footer className="bg-Doc text-white py-6 mt-10">
      <div className="container mx-auto text-center">
        <p className="text-sm">© {new Date().getFullYear()} Healthy Me. All rights reserved.</p>
        <div className="flex justify-center space-x-6 mt-3">
          <a href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </a>
          <a href="/terms-of-service" className="hover:underline">
            Terms of Service
          </a>
          <a href="/contact" className="hover:underline">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
