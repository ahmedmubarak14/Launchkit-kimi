"use client";

import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
}

const colors = ["#7C3AED", "#10B981", "#F59E0B", "#3B82F6", "#EF4444", "#EC4899"];

export function Confetti({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active && !visible) {
      setVisible(true);
      // Generate confetti pieces
      const newPieces: ConfettiPiece[] = [];
      for (let i = 0; i < 50; i++) {
        newPieces.push({
          id: i,
          x: Math.random() * 100,
          y: -20 - Math.random() * 20,
          rotation: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 8 + Math.random() * 8,
          delay: Math.random() * 0.5,
        });
      }
      setPieces(newPieces);

      // Hide after animation
      setTimeout(() => {
        setVisible(false);
        setPieces([]);
      }, 4000);
    }
  }, [active, visible]);

  if (!visible || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: "2px",
            transform: `rotate(${piece.rotation}deg)`,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
