/**
 * App — Main application shell.
 * Desktop: two-column (notes sidebar + calendar).
 * Tablet/Mobile: single column with FAB + bottom sheet.
 */

import Calendar from './components/Calendar/Calendar';
import NotesSidebar, {
  NotesBottomSheet,
  NotesFAB,
} from './components/Notes/NotesPanel';
import styles from './styles/calendar.module.css';

function App() {
  return (
    <div className={styles.appLayout}>
      {/* Desktop sidebar */}
      <NotesSidebar />

      {/* Calendar */}
      <Calendar />

      {/* Tablet/Mobile FAB + Bottom sheet */}
      <NotesFAB />
      <NotesBottomSheet />
    </div>
  );
}

export default App;
