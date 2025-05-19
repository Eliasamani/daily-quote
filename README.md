# DailyQuote

DailyQuote is a mobile app built with React Native, Firebase, and TypeScript that lets you browse inspirational quotes on demand. Whether you need motivation, love quotes, or just a quick dose of inspiration, DailyQuote lets you browse by category, save your favorites, create your own quotes.
---
## To run the project locally:
- Open a linux terminal in a folder.
- Type: ```git clone https://github.com/Eliasamani/daily-quote.git```
- Enter the project file: ```cd daily-quote```
- Run command: ```npm install```
- Then run ```npx expo start -c```
- Please note that you need an .env file in the root directory (./daily-quote) containing firebase credentials and an API key for the TTS.
---

## Team Members

- Elias Amani Rudäng 
- Salahudin Abdi Salah
- Marvin Haidari 

---

## Short Description
Browse inspirational quotes by category (Motivation, Love, Success, etc.), save your favorites, and create your own.

Quotes are fetched from the open‑source Quotable API; user‑created & saved quotes are stored in Firebase.
---
## Features

- **Browse on Demand**: Random quotes by category (Motivation, Love, Success, etc.)
- **Save Quotes**: Tap the heart to save favorites (no like‑count).
- **Create Quotes**: Submit your own with author & tags.
- **Comment**: Write comments under any quote.
- **Text‑to‑Speech**: Have quotes read aloud.
- **Authentication**:  Sign up / Log in (Email & Password) to save, create, and comment. Browsing and TTS work without an account..
---

## Frameworks & Technologies

- **React Native**
- **Firebase**
- **TypeScript** 

---

## API Usage
API that is used is open sourced and can be found here:
https://api.quotable.kurokeita.dev/


- **GET** `/api/quotes/random?category={category}`  
  Fetches a random quote by category.

- **POST** `/api/quotes`  
  Creates a new user-submitted quote.

- **GET** `/api/quotes/user?userId={userId}`  
  Fetches all quotes created by the user (My Quotes page).

- **GET** `/api/quotes/saved?userId={userId}`  
  Fetches all saved quotes (Saved Quotes page).

  > _Note: In‑app save/remove actions are handled via Firebase Firestore, not these HTTP routes._



---



## Data Handling

The app handles two main data types:

1. **API-Provided Data:**
   - **Random Quotes:** Includes content, author, tags, and a unique ID.
   - **User-Created Quotes:** Contains content, author, tags, ID.
   - **Saved Quotes:** Contains quoteId, content, author, and timestamp.


2. **App-Specific Data (Stored in Firestore):**
   - **User Saved Quotes:** Stored in `users/{userId}/savedQuotes`.
   - **User-Created Quotes:** Stored in the `quotes` collection.
---

## Project File Structure
- Find our third party component below:
```plaintext
.expo
.firebase
assets
.github
└── workflows
assets
dist
node_modules
src
├── api
│   ├── QuotableBase
│   │   └── quotable.ts
│   └── index.ts
├── components
│   |── Header.tsx
│   |── AuthRequiredModal.tsx
│   |── CommentsModal.tsx
│   └── Quote.tsx <---- Third Party component from "vector-icons"
├── config
│   └── firebase.ts
├── navigation
│   ├── AuthNavigator.tsx
│   ├── CreateQuotes.tsx
│   ├── DashboardNavigator.tsx
│   ├── MainStack.tsx
│   └── RootNavigator.tsx
├── presenters
│   ├── CreateQuotesPresenter.ts
│   ├── ExploreQuotesPresenter.ts
│   ├── HomePresenter.ts
│   ├── LoginPresenter.ts
│   ├── MyQuotesPresenter.ts
│   ├── RegisterPresenter.ts
│   └── SavedQuotesPresenter.ts
├── screens
│   ├── CreateQuotesScreen.tsx
│   ├── ExploreQuotesScreen.tsx
│   ├── HomeScreen.tsx
│   ├── LoginScreen.tsx
│   ├── MyQuotesScreen.tsx
│   ├── RegisterScreen.tsx
│   └── SavedQuotesScreen.tsx
├── store
│   ├── slices
│   │   ├── authSlice.ts
│   │   ├── createdQuoteSlices.ts
│   │   ├── exploreQuotesSilce.ts
│   │   ├── quote.ts
│   │   ├── quoteMetaSlice.ts
│   │   └── savedQuoteslice.tsx
│   ├── persistanceMiddleware.ts
│   └── store.ts
└── utils
    ├── GenerateQueryStringFrom.ts
    ├── index.ts
    ├── ProcessFetchReq.ts
    └── tts.ts
.env
.firebaserc
.gitignore
app.config.js
App.tsx
firebase.json
firebaseModel.ts
index.ts
metro.config.js
package-lock.json
package.json
README.md
tsconfig.json
