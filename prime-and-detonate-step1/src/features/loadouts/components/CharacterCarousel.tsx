import React from "react";
import type { Character } from "../types";

type Props = {
  characters: Character[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
};

export const CharacterCarousel: React.FC<Props> = ({ characters, currentIndex, onPrev, onNext, onSelect }) => {
  const current = characters[currentIndex];

  return (
    <div className="party-selector">
      <button id="prevChar" className="big ghost" onClick={onPrev} aria-label="Previous character">‹</button>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <div className="lfh-name" style={{ fontSize: 14 }}>{current.name}</div>
        <div className="lfh-class" style={{ fontSize: 11 }}>({current.className})</div>
        <div style={{ marginTop: 6, display: 'flex', gap: 8, justifyContent: 'center' }}>
          {characters.map((c, i) => (
            <button
              key={c.id}
              aria-label={`Switch to ${c.name}`}
              onClick={() => onSelect(i)}
              className={`slot-dot ${i === currentIndex ? 'is-filled' : ''}`}
              style={{ width: 8, height: 8 }}
            />
          ))}
        </div>
      </div>
      <button id="nextChar" className="big ghost" onClick={onNext} aria-label="Next character">›</button>
    </div>
  );
};


