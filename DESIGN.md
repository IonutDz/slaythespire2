# DESIGN.md — Slay the Shadow 2 (Stitch UI Design System)

This document encodes the **Spire Arcane Codex** visual design system for **Slay the Shadow 2**. It shifts the UI away from standard tech dashboards toward a high-fidelity, immersive dark-fantasy game HUD.

---

## 🎨 Design Tokens

### Colors
```json
{
  "theme": "Dark Fantasy Game HUD",
  "palette": {
    "background": {
      "obsidian": "#0a090b",
      "void-violet": "#120a1c",
      "portal-dark": "#160f24"
    },
    "borders": {
      "runic-purple": "#ff3ff0",
      "ironclad-crimson": "#d65a45",
      "silent-toxic": "#46a96f",
      "defect-lightning": "#4d8be8",
      "gold-metallic": "#d9b263",
      "abyssal-line": "rgba(255, 63, 240, 0.08)"
    },
    "text": {
      "parchment": "#f0eee8",
      "faded-pink": "rgba(255, 208, 232, 0.4)",
      "glowing-gold": "#ffd65a"
    }
  }
}
```

### Typography
*   **Header Titles (H1, H2, H3)**: `Cinzel` or `Cinzel Decorative` (serif, elegant, high-fantasy). Fallback: `Georgia, serif`.
*   **Body & Interactive Elements**: `Inter` or `Outfit` (sans-serif, crisp, excellent readability for card text).

---

## 🏛️ Core Components & Styling Rules

### 1. The Sculpted Navigation Bar (`.topbar`)
Instead of boxy tech buttons, the navigation is styled as a unified, floating dark-fantasy menu.
```css
.topbar {
  background: rgba(10, 9, 11, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 2px solid rgba(217, 178, 99, 0.25);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
  padding: 16px 32px;
}

.topbar-actions {
  background: rgba(0, 0, 0, 0.45);
  border: 2px solid rgba(217, 178, 99, 0.15);
  border-radius: 12px;
  padding: 6px;
}

.nav-link {
  color: rgba(240, 238, 232, 0.7);
  font-family: 'Cinzel', serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.nav-link:hover {
  color: #ffe0f3;
  background: rgba(255, 255, 255, 0.04);
}

.nav-link.active {
  background: linear-gradient(135deg, rgba(217, 178, 99, 0.25) 0%, rgba(217, 178, 99, 0.05) 100%);
  color: #ffd65a;
  border: 1px solid rgba(217, 178, 99, 0.4);
  box-shadow: 0 0 15px rgba(217, 178, 99, 0.15);
}
```

### 2. Glowing Runic Borders
Containers feature double borders representing enchanted runic seals.
```css
.runic-border {
  border: 2px solid var(--line-bright);
  box-shadow: 
    0 0 20px rgba(255, 63, 240, 0.05),
    inset 0 0 20px rgba(255, 63, 240, 0.05);
}
```

### 3. Class-Based Fantasy Card Grid Items
Cards represent real, physical cards with distinct metallic trims colored according to the character class:
```css
.card-item {
  border: 2px solid var(--line);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 50%), #141315;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.5);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.card-item:hover {
  border-color: var(--card-accent);
  box-shadow: 
    0 24px 48px rgba(0, 0, 0, 0.6),
    0 0 25px color-mix(in srgb, var(--card-accent) 25%, transparent);
  transform: translateY(-6px) scale(1.02);
}

.class-ironclad { --card-accent: #d65a45; }
.class-silent { --card-accent: #46a96f; }
.class-defect { --card-accent: #4d8be8; }
.class-regent { --card-accent: #d88b35; }
.class-necrobinder { --card-accent: #9d68d8; }
```

### 4. Interactive Runic Buttons
Action buttons (such as Class selection and Filters) light up like active runes on hover:
```css
.relic-card, .reset-button {
  font-family: 'Cinzel', serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(16, 15, 14, 0.86);
  border: 1px solid var(--line);
  transition: all 0.2s ease;
}

.reset-button:hover {
  border-color: #ffd65a;
  color: #ffd65a;
  box-shadow: 0 0 12px rgba(217, 178, 99, 0.2);
}
```
