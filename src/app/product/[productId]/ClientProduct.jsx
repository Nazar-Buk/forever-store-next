"use client";

import { useState } from "react";

export default function ClientProduct() {
  const [count, setCount] = useState(0);
  return (
    <>
      <h2>client page</h2>
      <button onClick={() => setCount((prev) => prev + 1)}>
        press the button
      </button>
      <p>{count}</p>
    </>
  );
}
