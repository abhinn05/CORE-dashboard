import { useEffect, useState } from "react";

export default function AnimatedNumber({
  value,
  duration = 900,
  decimals = 0,
  suffix = "",
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const target = Number(value);

    if (Number.isNaN(target)) return;

    let start = 0;
    let startTime;

    const animate = (time) => {
      if (!startTime) startTime = time;

      const progress = Math.min((time - startTime) / duration, 1);

      const current = start + (target - start) * progress;

      setDisplay(current);

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <>
      {display.toFixed(decimals)}
      {suffix}
    </>
  );
}