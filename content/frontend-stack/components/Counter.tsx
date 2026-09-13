"use client";

import { useState } from "react";

export const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <button
      className="rounded border border-neutral-300 px-3 py-1 text-sm"
      onClick={() => setCount((c) => c + 1)}
      type="button"
    >
      Count: {count}
    </button>
  );
};
