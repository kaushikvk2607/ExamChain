import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 z-50">
      <div className="container mx-auto">
        <p>Made with ❤️ by Team High Devs for Peak Hackathon</p>
        <p>© {new Date().getFullYear()} ExamChain - All rights reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
