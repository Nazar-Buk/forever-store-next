"use client";

import { useEffect } from "react";

const RemoveInitialLoader = () => {
  useEffect(() => {
    // const handleLoad = () => {
    const loader = document.getElementById("loader"); // перевіряємл чи є цей елемент після першого рендеру, useEffect має пустий масив залежностей
    if (loader) {
      //   loader.parentNode.removeChild(loader); // або loader.style.display = "none"
      loader.style.display = "none";
    }
    // };

    // window.addEventListener("load", handleLoad);

    // return () => window.removeEventListener("load", handleLoad);
  }, []);

  return null;
};

export default RemoveInitialLoader;
