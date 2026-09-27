import { useEffect, useState } from "react";

type Dot = {
  left: number;
  size: number;
  delay: number;
  duration: number;
  hue: "violet" | "azure" | "cyan";
};

export function Particles({ count = 26 }: { count?: number }) {
  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    const hues: Dot["hue"][] = ["violet", "azure", "cyan"];
    setDots(
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        size: 2 + Math.random() * 5,
        delay: Math.random() * 8,
        duration: 9 + Math.random() * 10,
        hue: hues[Math.floor(Math.random() * hues.length)],
      })),
    );
  }, [count]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((dot, i) => (
        <span
          key={i}
          className={`animate-drift absolute bottom-0 rounded-full ${
            dot.hue === "violet"
              ? "bg-violet"
              : dot.hue === "azure"
                ? "bg-azure"
                : "bg-cyan"
          }`}
          style={{
            left: `${dot.left}%`,
            width: dot.size,
            height: dot.size,
            animationDelay: `${dot.delay}s`,
            animationDuration: `${dot.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export function LightBeams() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="animate-beam absolute -top-40 left-[12%] h-[60rem] w-40 rotate-12 bg-gradient-to-b from-azure/25 to-transparent blur-2xl" />
      <div
        className="animate-beam absolute -top-52 left-[58%] h-[65rem] w-56 -rotate-6 bg-gradient-to-b from-violet/25 to-transparent blur-3xl"
        style={{ animationDelay: "2.5s" }}
      />
      <div
        className="animate-beam absolute -top-32 right-[8%] h-[50rem] w-32 rotate-6 bg-gradient-to-b from-cyan/20 to-transparent blur-2xl"
        style={{ animationDelay: "4.5s" }}
      />
    </div>
  );
}
