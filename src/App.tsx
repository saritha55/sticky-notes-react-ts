import React, { useRef } from 'react';
import Note from './components/Note';
import TrashZone from './components/TrashZone';
import { useLocalStorage } from './hooks/useLocalStorage';
import { NoteType } from './types';
import { v4 as uuidv4 } from 'uuid';
import { getNextZIndex } from './utils/zIndexManager';

const App: React.FC = () => {
  const [notes, setNotes] = useLocalStorage<NoteType[]>('sticky_notes', []);
  const trashRef = useRef<HTMLDivElement>(null);

  const createNote = () => {
    const newNote: NoteType = {
      id: uuidv4(),
      x: 100,
      y: 100,
      width: 200,
      height: 150,
      text: '',
      color: '#FFFA7C',
      zIndex: getNextZIndex(),
    };
    setNotes([...notes, newNote]);
  };

  const updateNote = (updatedNote: NoteType) => {
    setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
  };

  const removeNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div>
      <button onClick={createNote} style={{ margin: 20 }}>Create Note</button>
      {notes.map(note => (
        <Note
          key={note.id}
          note={note}
          onUpdate={updateNote}
          onRemove={removeNote}
          trashRef={trashRef}
        />
      ))}
      <TrashZone ref={trashRef} />
    </div>
  );
};

export default App;
