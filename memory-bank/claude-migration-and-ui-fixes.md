# Claude 3.7 Sonnet Migration and UI Fixes

## Date: May 14, 2025

## Changes Implemented

### 1. Migration from DeepSeek to Claude 3.7 Sonnet

- Installed Anthropic SDK: `npm install @anthropic-ai/sdk`
- Updated server.js to use Claude 3.7 Sonnet instead of DeepSeek:
  - Changed import from OpenAI to Anthropic
  - Updated model name to `claude-3-7-sonnet-20250219`
  - Modified API call structure to use `system` parameter instead of system message
  - Updated response parsing to match Claude's format
  - Kept the same system prompt for consistent poetry style
- Updated .env.example and .env with Anthropic API key
- Updated all documentation to reflect the change from DeepSeek to Claude

### 2. Mobile UI Fix for Memory Modal Buttons

- Fixed overlapping buttons in the MemoriesModal component on mobile screens
- Implemented responsive design:
  - Added vertical stacking on mobile (flex-col)
  - Made buttons full width on mobile for better touch targets
  - Added proper spacing between buttons
  - Reordered buttons on mobile to put primary action (Save) first
  - Preserved desktop layout (buttons side-by-side)

### 3. Favicon Update

- Updated favicon to use the app's logo (new-logo-no-background.png)
- Added favicon link tag in index.html
- Enhanced brand consistency across the application

## Technical Notes

- The Claude 3.7 Sonnet model requires different API parameters than DeepSeek
- System prompts are passed as a separate parameter rather than as a message
- Response format differs: Claude returns content in `response.content[0].text` format
- Mobile UI fixes only affect screens below 768px width (sm breakpoint in Tailwind)

## Testing

All changes have been tested and confirmed working:
- Poetry generation with Claude 3.7 Sonnet is functioning correctly
- Memory modal buttons display properly on mobile without overlapping
- Favicon appears correctly in browser tabs
