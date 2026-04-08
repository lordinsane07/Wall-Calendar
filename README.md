# 📅 Epoch Wall Calendar

A premium, interactive wall calendar component built with **React + TypeScript + Vite**. Designed to feel like a real, physical wall calendar — not just another flat digital grid.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)

---

## ✨ Features

### Core
- **📆 Drag-to-Select Date Ranges** — Click and drag across the grid to highlight a start date, end date, and everything in between with smooth visual states.
- **📝 Integrated Notes Panel** — Attach rich notes to any selected date range. Notes are organized into **Today**, **Month**, and **Recent** tabs for quick access.
- **📱 Fully Responsive** — Desktop shows a side-by-side layout; mobile gracefully transforms the Notes panel into a native-feeling bottom sheet with touch gestures.

### Creative Extras
- **🖼️ Seasonal Hero Imagery** — Curated landscape photography changes automatically with each month (Spring cherry blossoms, Summer beaches, Autumn leaves, Winter snow).
- **🎭 3D Parallax Effect** — The hero image subtly pans opposite to your mouse movement, simulating depth like looking through a real window.
- **🌙 Dark Mode** — Full dark theme support with smooth transitions.
- **🎉 Indian Holiday Markers** — National, religious, and regional Indian holidays are color-coded directly on the grid.
- **🔗 Cross-Highlighting** — Hover over any note in the sidebar and watch its corresponding days glow on the calendar grid.
- **🗓️ Year Overview** — Toggle to a 12-month bird's-eye view of the entire year.
- **🌦️ Live Weather Badge** — Current weather conditions displayed on the hero image (with rain/snow particle effects).
- **✏️ Custom SVG Empty States** — Hand-drawn notebook illustrations instead of boring "No data" text.
- **📌 Visual Legend** — Clear indicator key: ▲ Triangle = Note attached, ● Circle = Event on this day, ◆ Diamond = Today.

---

## 🏗️ Architecture & Tech Choices

| Layer | Choice | Why |
|---|---|---|
| **Framework** | React 19 + Vite 8 | Blazing fast HMR, modern ESM-first bundling |
| **Language** | TypeScript 6 | Type safety across components and state |
| **State** | Zustand | Lightweight, no boilerplate, with built-in `localStorage` persistence |
| **Date Math** | date-fns | Tree-shakeable, immutable date utilities |
| **Styling** | CSS Modules | Scoped styles, zero runtime cost, full CSS variable theming |
| **Persistence** | localStorage | Client-side only, as specified |

### Folder Structure
```
src/
├── components/
│   ├── Calendar/       # Calendar, CalendarGrid, DayCell, HeroImage, etc.
│   └── Notes/          # NotesPanel, NoteEditor (bottom sheet on mobile)
├── data/
│   ├── holidays.ts     # Indian holiday dataset
│   └── heroImages.ts   # Curated Unsplash hero image mappings
├── hooks/
│   └── useWeather.ts   # Geolocation-based weather hook
├── lib/
│   ├── calendarTypes.ts # Shared type definitions
│   └── dateUtils.ts     # Date formatting, range logic, grid math
├── store/
│   └── calendarStore.ts # Zustand store (navigation, notes, events, theme)
└── styles/
    ├── globals.css       # Design tokens, theme variables, wall texture
    ├── calendar.module.css # Calendar grid, hero, legend styles
    └── notes.module.css    # Notes panel, cards, bottom sheet styles
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation & Development
```bash
# Clone the repository
git clone https://github.com/lordinsane07/Wall-Calendar.git
cd Wall-Calendar

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

---

## 📐 Indicator Legend

| Symbol | Shape | Meaning |
|--------|-------|---------|
| ▲ | Triangle | A note is attached to this date |
| ● | Circle | An event exists on this day |
| ◆ | Diamond | Today's date |

---

## 🎨 Design Philosophy

The goal was to move beyond the typical flat, sterile digital calendar and create something that feels **tactile and physical**:

- **Plaster Wall Texture** — The background uses layered CSS gradients and SVG fractal noise to simulate a warm, gallery-like wall.
- **Paper & Ink Aesthetic** — Cream paper tones, serif typography (Playfair Display), and handwriting fonts (Caveat) evoke stationery.
- **Coil Binding** — A decorative spiral coil sits between the hero image and the date grid.
- **Glossy Photo Overlay** — The hero image has a subtle gloss effect mimicking printed photo paper.

---

## 📄 License

MIT
