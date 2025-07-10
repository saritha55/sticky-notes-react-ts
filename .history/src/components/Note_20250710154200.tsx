import React, { useState, useRef } from 'react';
import { NoteType } from '../types';
import { getNextZIndex } from '../utils/zIndexManager';

interface Props {
  note: NoteType;
  onUpdate: (note: NoteType) => void;
  onRemove: (id: string) => void;
  trashRef: React.RefObject<HTMLDivElement | null>;
}

const COLORS = ['#FFFA7C', '#FFB6C1', '#90EE90', '#ADD8E6'];

const Note: React.FC<Props> = ({ note, onUpdate, onRemove, trashRef }) => {
  const noteRef = useRef<HTMLDivElement>(null);
  const [isDragging, setDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const offsetX = e.clientX - note.x;
    const offsetY = e.clientY - note.y;
    setDragging(true);

    const mouseMoveHandler = (moveEvent: MouseEvent) => {
      const newX = moveEvent.clientX - offsetX;
      const newY = moveEvent.clientY - offsetY;
      onUpdate({ ...note, x: newX, y: newY, zIndex: getNextZIndex() });

      if (trashRef.current) {
        const trashRect = trashRef.current.getBoundingClientRect();
        const noteRect = noteRef.current?.getBoundingClientRect();
        if (
          noteRect &&
          noteRect.right > trashRect.left &&
          noteRect.left < trashRect.right &&
          noteRect.bottom > trashRect.top &&
          noteRect.top < trashRect.bottom
        ) {
          trashRef.current.style.background = '#ff4d4f';
        } else {
          trashRef.current.style.background = '#ddd';
        }
      }
    };

    const mouseUpHandler = () => {
      setDragging(false);
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);

      const trashRect = trashRef.current?.getBoundingClientRect();
      const noteRect = noteRef.current?.getBoundingClientRect();
      if (
        trashRect &&
        noteRect &&
        noteRect.right > trashRect.left &&
        noteRect.left < trashRect.right &&
        noteRect.bottom > trashRect.top &&
        noteRect.top < trashRect.bottom
      ) {
        onRemove(note.id);
      }

      if (trashRef.current) {
        trashRef.current.style.background = '#ddd';
      }
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  const handleResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = note.width;
    const startHeight = note.height;

    const mouseMoveHandler = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(100, startWidth + (moveEvent.clientX - startX));
      const newHeight = Math.max(100, startHeight + (moveEvent.clientY - startY));
      onUpdate({ ...note, width: newWidth, height: newHeight });
    };

    const mouseUpHandler = () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  return (
    <div
      ref={noteRef}
      className="note"
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: note.x,
        top: note.y,
        width: note.width,
        height: note.height,
        background: note.color,
        zIndex: note.zIndex,
        padding: 10,
        boxSizing: 'border-box',
        border: '1px solid #ccc',
        borderRadius: 4,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <textarea
        value={note.text}
        onChange={(e) => onUpdate({ ...note, text: e.target.value })}
        style={{
          width: '100%',
          height: '80%',
          resize: 'none',
          border: 'none',
          background: 'transparent',
          outline: 'none',
        }}
      />

      {/* ✅ Color picker using COLORS */}
      <div style={{ display: 'flex', gap: 5, marginTop: 5 }}>
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={(e) => {
              e.stopPropagation();
              onUpdate({ ...note, color });
            }}
            style={{
              backgroundColor: color,
              width: 20,
              height: 20,
              border: note.color === color ? '2px solid black' : '1px solid #ccc',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
            title={`Set color to ${color}`}
          />
        ))}
      </div>

      <div
        onMouseDown={handleResize}
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: 10,
          height: 10,
          background: '#888',
          cursor: 'nwse-resize',
        }}
      />
    </div>
  );
};

export default Note;
