
import React from "react";

export default function Footer() {
  return (
    <footer className="footer text-center py-3">
      <p className="mb-0 small text-white">
        Powered by <strong>Open Library API</strong> • © {new Date().getFullYear()}
      </p>
    </footer>
  );
}
