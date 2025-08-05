"use client";

import { useEffect } from "react";

const RemoveInitialLoader = () => {
  useEffect(() => {
    const loader = document.getElementById("loader");
    if (loader) {
      //   loader.parentNode.removeChild(loader); // або loader.style.display = "none"
      loader.style.display = "none";
    }
  }, []);

  return null;
};

export default RemoveInitialLoader;
