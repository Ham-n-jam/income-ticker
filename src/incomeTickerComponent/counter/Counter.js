// Adapted from https://erikmartinjordan.com/animation-counter

import React, { useEffect, useState } from "react";
import "./Counter.css";

export default function Counter({ val }) {
  const [count, setCount] = useState(0);
  const [animationCount, setAnimationCount] = useState("initial");
  useEffect(() => {
    updateCount(val);
  }, [val]);

  function updateCount(newVal) {
    console.log(newVal, count);
    if (newVal !== count) {
      // 1. Old number goes up
      setTimeout(() => setAnimationCount("goUp"), 0);
      // 2. Incrementing the counter
      setTimeout(() => setCount(newVal), 100);
      // 3. New number waits down
      setTimeout(() => setAnimationCount("waitDown"), 100);
      // 4. New number stays in the middle
      setTimeout(() => setAnimationCount("initial"), 200);
    }
  }

  return (
    <div className="Grid">
      <div className="Likes">
        <span className={animationCount}>{count}</span>
      </div>
    </div>
  );
}
