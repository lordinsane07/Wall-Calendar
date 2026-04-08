/**
 * NotesPanel — Premium desktop sidebar and mobile bottom sheet for notes.
 * Features: rich empty state, note cards with preview, save confirmation,
 * and elegant typography.
 */

import { memo, useCallback, useState } from 'react';
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
      {/* Notepad header */}
      <div className={styles.notesPanelHeader}>
        <div className={styles.notesPanelTitle}>Notes</div>
        {notes.length > 0 && (
          <span className={styles.noteCount}>{notes.length}</span>
        )}
      </div>

      <div className={styles.notesPanelContent}>
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
              <EmptyState />
            )}
          </>
        )}
      </div>
    </div>
  );
});

/** Premium empty state */
const EmptyState = memo(function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="6" width="28" height="36" rx="3" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
          <line x1="16" y1="16" x2="32" y2="16" stroke="currentColor" strokeWidth="1.5" opacity="0.2"/>
          <line x1="16" y1="22" x2="28" y2="22" stroke="currentColor" strokeWidth="1.5" opacity="0.2"/>
          <line x1="16" y1="28" x2="30" y2="28" stroke="currentColor" strokeWidth="1.5" opacity="0.2"/>
          <circle cx="24" cy="34" r="3" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
        </svg>
      </div>
      <h3 className={styles.emptyTitle}>No notes yet</h3>
      <p className={styles.emptyDesc}>
        Select a date range on the calendar to start writing notes
      </p>
      <div className={styles.emptyHint}>
        <span className={styles.emptyKey}>Click</span> a date to start
        <br />
        <span className={styles.emptyKey}>Click</span> another date to set range
      </div>
    </div>
  );
});

/** Helper component for rendering a single note */
interface NoteCardItemProps {
  note: any;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const NoteCardItem = memo(function NoteCardItem({ note, onClick, onMouseEnter, onMouseLeave }: NoteCardItemProps) {
  return (
    <div
      className={styles.noteCard}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onPointerEnter={onMouseEnter}
      onPointerLeave={onMouseLeave}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClick();
      }}
    >
      <div className={styles.noteCardHeader}>
        <span className={styles.noteCardTitle}>
          {note.title || 'Untitled'}
        </span>
        <span className={styles.noteCardDate}>
          {formatRangeLabel(
            new Date(note.rangeStart),
            new Date(note.rangeEnd)
          )}
        </span>
      </div>
      {note.content && (
        <div className={styles.noteCardPreview}>
          {note.content.length > 80
            ? note.content.slice(0, 80) + '…'
            : note.content}
        </div>
      )}
      <div className={styles.noteCardMeta}>
        {new Date(note.updatedAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  );
});

/** List of existing notes, grouped by relevance */
const NotesList = memo(function NotesList() {
  const notes = useCalendarStore((s) => s.notes);
  const viewMonth = useCalendarStore((s) => s.viewMonth);
  const viewYear = useCalendarStore((s) => s.viewYear);
  const handleDayClick = useCalendarStore((s) => s.handleDayClick);
  const setHoveredNoteId = useCalendarStore((s) => s.setHoveredNoteId);

  const handleNoteClick = useCallback(
    (rangeStart: string, rangeEnd: string) => {
      const start = new Date(rangeStart);
      const end = new Date(rangeEnd);
      handleDayClick(start);
      setTimeout(() => handleDayClick(end), 50);
    },
    [handleDayClick]
  );

  // Sort notes by most recent first
  const sortedNotes = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);

  const [activeTab, setActiveTab] = useState<'today' | 'month' | 'recent'>('month');

  // Group notes
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayNotes: typeof notes = [];
  const monthNotes: typeof notes = [];
  const olderNotes: typeof notes = [];

  sortedNotes.forEach((note) => {
    const start = new Date(note.rangeStart);
    const end = new Date(note.rangeEnd);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const isTodayNote = today >= start && today <= end;
    
    // Check if note overlaps with the viewing month
    const viewMonthStart = new Date(viewYear, viewMonth, 1);
    const viewMonthEnd = new Date(viewYear, viewMonth + 1, 0, 23, 59, 59);
    const isViewMonthNote = start <= viewMonthEnd && end >= viewMonthStart;

    if (isTodayNote) {
      todayNotes.push(note);
    } else if (isViewMonthNote) {
      monthNotes.push(note);
    } else {
      olderNotes.push(note);
    }
  });

  const tabs = [
    { id: 'today', label: 'Today', count: todayNotes.length },
    { id: 'month', label: 'Month', count: monthNotes.length },
    { id: 'recent', label: 'Recent', count: olderNotes.length },
  ] as const;

  const displayedNotes = 
    activeTab === 'today' ? todayNotes :
    activeTab === 'month' ? monthNotes :
    olderNotes;

  return (
    <div className={styles.notesList}>
      <div className={styles.notesTabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.notesTab} ${activeTab === tab.id ? styles.notesTabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className={styles.notesTabCount}>{tab.count}</span>
          </button>
        ))}
      </div>

      {displayedNotes.length > 0 ? (
        displayedNotes.map((note) => (
          <NoteCardItem
            key={note.id}
            note={note}
            onClick={() => handleNoteClick(note.rangeStart, note.rangeEnd)}
            onMouseEnter={() => setHoveredNoteId(note.id)}
            onMouseLeave={() => setHoveredNoteId(null)}
          />
        ))
      ) : (
        <div className={styles.emptyStateContainer} style={{ marginTop: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.15, marginBottom: '12px' }}>
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
          </svg>
          <div className={styles.emptyStateText} style={{ opacity: 0.4, fontSize: '11px', letterSpacing: '0.02em' }}>
            Nothing for {activeTab} yet.
          </div>
        </div>
      )}
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
        <div className={styles.notesPanelHeader}>
          <div className={styles.notesPanelTitle}>Notes</div>
          {notes.length > 0 && (
            <span className={styles.noteCount}>{notes.length}</span>
          )}
        </div>

        {showEditor && rangeLabel && (
          <div className={styles.rangeLabel}>
            <RangeAnnotation text={rangeLabel} />
          </div>
        )}

        {showEditor ? (
          <NoteEditor />
        ) : notes.length > 0 ? (
          <NotesList />
        ) : (
          <EmptyState />
        )}
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
      {notes.length > 0 && (
        <span className={styles.fabBadge}>{notes.length}</span>
      )}
    </button>
  );
});

export default NotesSidebar;
