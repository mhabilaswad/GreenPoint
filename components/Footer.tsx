import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-black text-center py-4">
      <p className="text-green-600 oppacity-50">© {new Date().getFullYear()} Made by HN</p>
    </footer>
  );
};

export default Footer;