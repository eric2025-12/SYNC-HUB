import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} SyncHub. All rights reserved.</p>
      <p className="footer-links">
        <a href="#">About</a> | <a href="#">Privacy</a> | <a href="#">Contact</a>
      </p>
    </footer>
  );
};

export default Footer;
