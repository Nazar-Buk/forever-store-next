"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";

/** це просто коментар, ну і трошки типізації щоб vscode міг підказати розробнику про типи
 * @param {{ message: string | null, type?: "success" | "error" | "info" | "warning" }} props
 */

const ToastSSRMessage = ({ message, type = "error" }) => {
  console.log(message, "message");
  console.log(type, "type");
  useEffect(() => {
    if (message) {
      toast[type](message);
    }
  }, [message, type]);
  return null;
};

export default ToastSSRMessage;
