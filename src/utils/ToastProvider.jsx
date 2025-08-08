"use client";

import { ToastContainer } from "react-toastify";

const ToastProvider = () => {
  return <ToastContainer position="top-center" autoClose={1800} />;
};

export default ToastProvider;
