# Easy Chart Widget

A single-page, no-code / low-code tool for **non-technical bloggers** to turn JSON data into charts and export them as **copy‑paste embeds**.

![preview of the app](./public/app-preview.jpg)

**Mental model:**

> Paste JSON → Choose chart → Preview instantly → Copy embed

No setup. No config files. No jargon.

---

## What This App Does

* Accepts raw JSON data (or loads built‑in dummy data)
* Converts the data into a visual chart
* Lets users switch between chart types
* Generates a ready‑to‑paste embed that works on any site

---

## Core Features (MVP)

### 1. Data Input

* JSON textarea input
* "Load dummy data" button
* Generate chart
* Take screenshot or copy embed code

---

### 2. Chart Type Selector

Users can switch between:

* Bar
* Line
* Pie
* Doughnut

The chart updates instantly when the type changes.

---

### 3. Live Chart Preview

* Responsive preview canvas
* Immediate feedback on data or chart changes

**Library used**

* `recharts`

Recharts handles all interactive rendering inside the application.

---

### 5. Embed Export

The app generates a **embed** that users can paste anywhere.

Supported formats:

* Inline embed
* Screenshots

---

## Tech Stack

### Required

* React
* Vite
* Recharts
* Tailwind CSS

---

## Non‑Goals

* No dashboards
* No saved user accounts
* No complex chart configuration

---

## Development Notes

* The app itself uses **Recharts** for previewing charts
* The embed output is treated as a portable artifact, not a live connection to the app
