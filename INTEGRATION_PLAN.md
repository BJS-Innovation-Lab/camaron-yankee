# Integration Plan: Camarón Yankee v8

## 1. Authentication & User Profile
- Add a "Login" button to the top right of the hero section.
- Implement Supabase Auth (Email/Password or Magic Link).
- Create a `profiles` table in Supabase to store:
  - `user_id` (UUID)
  - `name` (Text)
  - `preferred_zone` (Enum: 'comedor', 'playa')
  - `common_total` (Numeric)
  - `visit_count` (Int)
  - `last_notes` (Text)

## 2. Interactive Menu (The "Secret Library" effect)
- **Visual:** A small, decorative "Library Spine" or "Wooden Plank" icon fixed to the top right of the viewport.
- **Animation:** Use `framer-motion` (or vanilla CSS 3D transforms) to create a "Book Unfolding" animation.
  - The menu will be a modal that appears to "hinge" open from the center.
  - Background will blur (`backdrop-filter: blur(10px)`) to focus on the menu.
- **Close Action:** A floating 'X' button in the bottom right of the top-half of the screen.
- **Content:** Populate with the extracted data from "El Camarón Jackie" (prices, items, categories).

## 3. Personalization Engine
- On login, fetch the user's last 5 reservations.
- Calculate:
  - `most_frequent_area`: Based on `area` field in `reservaciones`.
  - `average_guests`: Based on `guests` field.
- **UI Feedback:** "Welcome back, [Name]! Would you like your usual table in the [Area] for [Guests] people?"

## 4. File Structure Changes
- `agenda-restaurantes/index.html` -> Main entry point (updated).
- `agenda-restaurantes/auth.js` -> Auth logic.
- `agenda-restaurantes/menu-data.json` -> Static menu data.
- `agenda-restaurantes/menu-component.js` -> The interactive book component.

## 5. Deployment
- Push to GitHub `VULKN-AI/camaron-yankee`.
- Vercel will auto-deploy the new version.
