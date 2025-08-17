# Kviss Frontend 🎮✨

Frontend for **Kviss**, a real-time multiplayer quiz app with AI-generated questions.  
Built with Vue 3 (Composition API), Nuxt 3, Pinia, and TailwindCSS. Designed to provide a playful yet uncluttered interface for group quiz sessions.  

---


## ✨ Features
- 🎨 Intuitive UI for creating or joining quizzes  
- 🧑‍🤝‍🧑 Multiplayer support with synced gameplay flow  
- 🤖 AI-powered quiz generation using OpenAI GPT-4o  
- ⚡ Real-time updates via WebSockets (Socket.io on backend)  
- 🗂️ State management with Pinia  
- 🎭 Mobile-friendly design  

---

## 📡 Status
🚧 **Work in Progress**  
- ✅ Create quiz with theme, difficulty, number of questions  
- ✅ Join games and play in real time  
- ✅ Game flow syncs across players  
- 🔜 UX improvements to landing page (simplify choices)  
- 🔜 Better loading indicators when generating quiz 
- 🔜 Improved cues to show wrong/correct answer  

---


## 🛠️ Tech Stack
- Vue 3 (Composition API)  
- Nuxt 3 (SSR)  
- Pinia for state management  
- TailwindCSS for styling  
- Socket.io for multiplayer sync (via backend)  
- OpenAI API for quiz generation  

---


## 🚀 Getting Started

### Run locally
```bash
# Clone repo
git clone https://github.com/juliadyrdal/kviss-frontend.git
cd kviss-frontend

# Install dependencies
pnpm install

# Environment setup
cp .env.example .env 

# Run locally
pnpm dev

# Server will run at
http://localhost:3000
```

---