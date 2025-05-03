# **Gorlea's Journal – Project Brief**

### **🔹 Project Purpose**
The Mindful Inkwell Journal is a web-based app that makes journaling simple and fun! Users can jot down their thoughts via text or voice, with some cool AI tricks to transcribe recordings, polish entries, and even whip up poems based on what they write. It’s all about mixing classic journaling vibes with cutting-edge tech for a creative, user-friendly experience.

---

### **🛠️ Tech Stack**
- **Frontend**: React with Vite, TypeScript, Tailwind CSS, shadcn/ui, Lucide React, React Router  
- **Backend**: Firebase (Firestore for data, Firebase Auth for user login)  
- **AI Services**: OpenAI’s GPT-4o-mini for speech-to-text, GPT-4.1-mini for journal entry creation, parsing, and poetry writing  
- **Other Goodies**: RecordRTC for voice recording, date-fns for dates, Sonner for toast pop-ups  

---

### **🏗️ Architecture**
The app revolves around two core pages:  
- **Entries List (`/entries`)**: Shows all your journal entries in neat collapsible cards—each with the entry, an AI poem, and a timestamp. Plus, floating buttons to start a new text or simulated voice entry (the microphone button now saves a simulated voice entry to Firestore, persisting like manual entries).  
- **New Entry (`/new`)**: A full-screen spot to write or record new entries, with a toggle for voice mode and visual cues while recording.  

Key pieces:  
- **EntriesList.tsx**: Handles showing entries and kicking off new ones.  
- **NewEntryModal.tsx**: A pop-up for text entries with validation and success messages.  
- **NewEntry.tsx**: Manages both text and voice inputs, tying into recording and AI features.  

State’s kept simple with React’s `useState` hooks for now—might level up later if needed.

Simulated voice entries are now supported and persist after refresh, matching manual entries. Real voice-to-text transcription will be integrated in a future phase.

---

### **🔗 Integration Points**
- **Firebase**:  
  - **Firestore**: Saves entries (content, poems, timestamps, user IDs).  
  - **Authentication**: Google Sign-In via Firebase Auth to keep things secure.  
- **OpenAI**:  
  - **Speech-to-Text**: GPT-4o-mini turns voice recordings into text.  
  - **Text Magic**: GPT-4.1-mini helps craft or tweak entries and writes poems from them.  
- **Voice Recording**: RecordRTC grabs mic audio, then hands it off to OpenAI for transcription.

---

### **🤖 AI Integration**
We’re tapping OpenAI for two big wins:  
1. **Speech-to-Text Transcription**:  
   - GPT-4o-mini transcribes voice recordings into text for entries.  
   - Built into the voice feature—speak your mind, and it’s typed out for you.  
2. **Text Generation and Poetry Writing**:  
   - GPT-4.1-mini steps in to enhance journal entries and create poems based on what you write.  
   - Save an entry, and boom—the AI spins a poem to pair with it, stored and shown right alongside.

---

### **💡 Development Notes**
- Dark theme vibes with colors set in `tailwind.config.ts`.  
- Sonner handles toast notifications for slick feedback.  
- Animations add a little flair to the UX.  
- Everything’s responsive—looks great on any screen.  
- Simulated voice entries (created via the microphone button in EntriesList) are now saved to Firestore and persist after refresh, matching manual entries.
- Keep API keys safe in environment variables, not the repo!  
- Hosted on GitHub Pages to start, with Vercel on deck for future upgrades.

---

### **🌐 Deployment**
Kicking things off on GitHub Pages—easy and free! As we grow and add fancier stuff like server-side rendering or APIs, we’ll shift over to Vercel.
