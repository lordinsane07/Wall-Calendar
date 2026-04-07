/**
 * NotesPanel — Desktop sidebar and mobile bottom sheet for notes.
 * Shows range label with handwriting annotation, editor, and notes list.
 */

import { memo, useCallback } from 'react';
import { useCalendarStore } from '../../store/calendarStore';
import { formatRangeLabel } from '../../lib/dateUtils';
import NoteEditor from './NoteEditor';
import RangeAnnotation from './RangeAnnotation';
import styles from '../../styles/notes.module.css';

/** Desktop sidebar version */
const NotesSidebar = memo(function NotesSidebar() {
  const range = useCalendarStore((s) => s.range);
  const selectionState = useCalendarStore((s) => s.selectionState);
  const notes = useCalendarStore((s) => s.notes);

  const rangeLabel = formatRangeLabel(range.start, range.end);
  const showEditor = selectionState === 'selected' && range.start && range.end;

  return (
    <div className={styles.notesPanel}>
      <div className={styles.notesPanelTitle}>Notes</div>

      {showEditor && rangeLabel && (
        <div className={styles.rangeLabel}>
          <RangeAnnotation text={rangeLabel} />
        </div>
      )}

      {showEditor ? (
        <NoteEditor />
      ) : (
        <>
          {notes.length > 0 ? (
            <NotesList />
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>📅</div>
              <p>Click dates to create a range, then add notes</p>
            </div>
          )}
        </>
      )}
    </div>
  );
});

/** List of existing notes */
const NotesList = memo(function NotesList() {
  const notes = useCalendarStore((s) => s.notes);
  const handleDayClick = useCalendarStore((s) => s.handleDayClick);

  const handleNoteClick = useCallback(
    (rangeStart: string, rangeEnd: string) => {
      const start = new Date(rangeStart);
      const end = new Date(rangeEnd);
      // Select the range then open note
      handleDayClick(start);
      setTimeout(() => handleDayClick(end), 50);
    },
    [handleDayClick]
  );

  return (
    <div className={styles.notesList}>
      {notes.map((note) => (
        <div
          key={note.id}
          className={styles.noteItem}
          onClick={() => handleNoteClick(note.rangeStart, note.rangeEnd)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleNoteClick(note.rangeStart, note.rangeEnd);
          }}
        >
          <div className={styles.noteItemTitle}>
            {note.title || 'Untitled note'}
          </div>
          <div className={styles.noteItemRange}>
            {formatRangeLabel(
              new Date(note.rangeStart),
              new Date(note.rangeEnd)
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

/** Mobile bottom sheet version */
export const NotesBottomSheet = memo(function NotesBottomSheet() {
  const notesPanelOpen = useCalendarStore((s) => s.notesPanelOpen);
  const setNotesPanelOpen = useCalendarStore((s) => s.setNotesPanelOpen);
  const range = useCalendarStore((s) => s.range);
  const selectionState = useCalendarStore((s) => s.selectionState);
  const notes = useCalendarStore((s) => s.notes);

  const rangeLabel = formatRangeLabel(range.start, range.end);
  const showEditor = selectionState === 'selected' && range.start && range.end;

  const handleOverlayClick = useCallback(() => {
    setNotesPanelOpen(false);
  }, [setNotesPanelOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.bottomSheetOverlay} ${notesPanelOpen ? styles.visible : ''}`}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className={`${styles.bottomSheet} ${notesPanelOpen ? styles.open : ''}`}
        role="dialog"
        aria-label="Notes panel"
      >
        <div className={styles.bottomSheetHandle} />
        <div className={styles.notesPanelTitle}>Notes</div>

        {showEditor && rangeLabel && (
          <div className={styles.rangeLabel}>
            <RangeAnnotation text={rangeLabel} />
          </div>
        )}

        {showEditor ? <NoteEditor /> : <NotesList />}
      </div>
    </>
  );
});

/** FAB button for tablet/mobile */
export const NotesFAB = memo(function NotesFAB() {
  const toggleNotesPanel = useCalendarStore((s) => s.toggleNotesPanel);
  const notes = useCalendarStore((s) => s.notes);

  return (
    <button
      className={styles.fab}
      onClick={toggleNotesPanel}
      aria-label={`Notes (${notes.length})`}
    >
      📝
    </button>
  );
});

export default NotesSidebar;
