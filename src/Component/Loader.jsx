// components/Loader.tsx
"use client";

import React from "react";
import "./Loader.css"; // Import CSS for styling

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p>Loading...</p>
    </div>
  );
};

export default Loader;
