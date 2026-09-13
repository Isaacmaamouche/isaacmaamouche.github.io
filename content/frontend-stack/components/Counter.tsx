"use client";

import { useState } from "react";

export const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col gap-2 items-start">
      <p>Count: {count}</p>

      <button
        className="cursor-pointer rounded-lg border border-neutral-300 px-3 py-1 text-sm"
        onClick={() => setCount((c) => c + 1)}
        type="button"
      >
        increment
      </button>
    </div>
  );
};
