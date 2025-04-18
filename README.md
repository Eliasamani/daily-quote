What we have done so far:
1) Integrated an API into the project.
2) Users can create new quotes, which are saved in Firebase. This functionality is implemented in the Create Quotes footer.
3) Users can retrieve quotes based on genre, minimum length, maximum length, or specific search words. This is implemented in the Explore Quotes footer
4) Established a solid foundation to continue implementing additional functionalities.

What is left to do:
1) Allow users to save quotes.
2) Enable users to rate quotes.
3) Implement text-to-speech functionality.
4) Additional UI/UX Improvements:



# DailyQuote

DailyQuote is a mobile app built with React Native, Firebase, and TypeScript that delivers daily inspirational quotes to its users. Whether you need motivation, love quotes, or just a quick dose of inspiration, DailyQuote lets you browse by category, save your favorites, create your own quotes, and rate quotes from other users.

---

## Team Members

- Elias Amani Rudäng 
- Salahudin Abdi Salah
- Marvin Haidari 

---

## Short Description

DailyQuote delivers tailored daily quotes based on a user’s mood or interests. It allows users to:
- Browse random quotes by category (e.g., motivation, love)
- Save favorite quotes
- Create and submit their own quotes
- Rate submitted quotes

All data is managed via Firebase.

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

- **POST** `/api/quotes/save`  
  Saves a quote to a user’s favorites.

- **POST** `/api/quotes`  
  Creates a new user-submitted quote.

- **POST** `/api/quotes/{quoteId}/rate`  
  Rates a quote and updates its average rating.

- **GET** `/api/quotes/user?userId={userId}`  
  Fetches all quotes created by the user (My Quotes page).

- **GET** `/api/quotes/saved?userId={userId}`  
  Fetches all saved quotes (Saved Quotes page).

- **DELETE** `/api/quotes/saved`  
  Removes a quote from the saved list.

---

## Data Handling

The app handles two main data types:

1. **API-Provided Data:**
   - **Random Quotes:** Includes content, author, tags, and a unique ID.
   - **User-Created Quotes:** Contains content, author, tags, ID, and average rating.
   - **Saved Quotes:** Contains quoteId, content, author, and timestamp.
   - **Ratings:** Returns average rating and total ratings for a quote.

2. **App-Specific Data (Stored in Firestore):**
   - **User Saved Quotes:** Stored in `users/{userId}/savedQuotes`.
   - **User-Created Quotes:** Stored in the `quotes` collection.
   - **Ratings:** Stored in the `ratings` collection (includes quoteId, userId, rating, and timestamp).

---

## Project File Structure

```plaintext
.expo
.firebase
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
│   └── Header.tsx
├── config
│   └── firebase.ts
├── models
│   ├── AuthUser.ts
│   └── ExploreQuotesModel.ts
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
│   │   └── quote.ts
│   └── store.ts
└── utils
    ├── GenerateQueryStringFrom.ts
    ├── index.ts
    └── ProcessFetchReq.ts
.env
.firebaserc
.gitignore
app.config.js
App.tsx
firebase.json
index.ts
package-lock.json
package.json
README.md
tsconfig.json
