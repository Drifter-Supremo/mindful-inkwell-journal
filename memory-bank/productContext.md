# Product Context

## Why This Project Exists

Gorlea's Ink (formerly Mindful Inkwell) is designed to make journaling accessible, enjoyable, and creative for everyone. It addresses the challenge of maintaining a regular journaling habit by blending traditional writing with modern AI-powered features, making the process both simple and engaging.

## Problems It Solves

- **Barriers to Journaling:** Many users struggle with consistency or feel intimidated by blank pages. The app lowers these barriers by offering both text and real voice input (with automatic transcription), making it easy to capture thoughts in any moment.
- **Time Constraints:** Quick entry options and voice-to-text transcription allow users to journal even when short on time.
- **Creative Expression:** AI-generated poetry and entry enhancement inspire users to reflect and express themselves more deeply.
- **Accessibility:** Voice recording and real-time transcription (powered by OpenAI) make journaling accessible to users who prefer speaking or have difficulty typing.

## How It Should Work

- Users can create journal entries via text or voice (with AI-powered transcription).
- Simulated voice entries can be created using the microphone button in the entries list; these are saved to Firestore and persist after refresh, just like manual entries.
- Voice entries will be transcribed automatically using AI in a future phase.
- After saving an entry, the AI generates a poem based on the content, displayed alongside the entry.
- Entries are organized in collapsible cards, each showing the original entry, AI poem, and timestamp.
- The interface is responsive, visually appealing, and easy to navigate, with floating action buttons for quick entry creation.

## User Experience Goals

- **Simplicity:** Minimalist, intuitive UI that encourages frequent use, with clean empty states and clear guidance.
- **Branding:** Consistent use of Gorlea's Ink branding and logo throughout the application.
- **Creativity:** AI features that add value and delight, such as poetry generation and entry polishing.
- **Accessibility:** Support for both text and voice input, with simulated voice entries now persisting like manual entries; responsive design for all devices.
- **Feedback:** Real-time notifications and visual cues for actions like saving, recording, and errors.
- **Security:** User authentication via Google Sign-In with official Google colors and logo to protect privacy and data.

Gorlea's Ink aims to foster mindfulness, creativity, and consistency in journaling through a seamless blend of classic and modern technology.
