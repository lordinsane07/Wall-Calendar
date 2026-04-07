/**
 * NoteEditor — Title input, textarea with ruled-line background,
 * Save/Clear/Delete buttons with ink-stamp animation.
 */

import { memo, useState, useCallback, useEffect } from 'react';
import { useCalendarStore } from '../../store/calendarStore';
import styles from '../../styles/notes.module.css';

const NoteEditor = memo(function NoteEditor() {
  const activeNote = useCalendarStore((s) => s.activeNote);
  const range = useCalendarStore((s) => s.range);
  const saveNote = useCalendarStore((s) => s.saveNote);
  const deleteNote = useCalendarStore((s) => s.deleteNote);
  const clearSelection = useCalendarStore((s) => s.clearSelection);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [stamped, setStamped] = useState(false);

  // Sync with active note when it changes
  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [activeNote]);

  const handleSave = useCallback(() => {
    if (!range.start || !range.end) return;
    saveNote(title, content);

    // Ink stamp animation
    setStamped(true);
    setTimeout(() => setStamped(false), 300);
  }, [title, content, range, saveNote]);

  const handleDelete = useCallback(() => {
    if (activeNote) {
      deleteNote(activeNote.id);
    }
  }, [activeNote, deleteNote]);

  const handleClear = useCallback(() => {
    clearSelection();
    setTitle('');
    setContent('');
  }, [clearSelection]);

  const hasSelection = range.start && range.end;

  if (!hasSelection) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon}>📝</div>
        <p>Select a date range to add a note</p>
      </div>
    );
  }

  return (
    <div className={styles.noteEditor}>
      <input
        className={styles.noteTitleInput}
        type="text"
        placeholder="Note title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Note title"
      />
      <textarea
        className={styles.noteTextarea}
        placeholder="Write your note here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        aria-label="Note content"
      />
      <div className={styles.noteActions}>
        <button
          className={`${styles.saveButton} ${stamped ? styles.stamped : ''}`}
          onClick={handleSave}
          aria-label="Save note"
        >
          Save
        </button>
        {activeNote && (
          <button
            className={styles.deleteButton}
            onClick={handleDelete}
            aria-label="Delete note"
          >
            Delete
          </button>
        )}
        <button
          className={styles.clearButton}
          onClick={handleClear}
          aria-label="Clear selection"
        >
          Clear
        </button>
      </div>
    </div>
  );
});

export default NoteEditor;
