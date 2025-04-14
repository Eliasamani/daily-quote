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

- Elias Amani Rudäng (Canvas ID: 95366)
- Salahudin Abdi Salah (Canvas ID: 124507)
- Marvin Haidari (Canvas ID: 124482)

---

## Short Description

DailyQuote delivers tailored daily quotes based on a user’s mood or interests. It allows users to:
- Browse random quotes by category (e.g., motivation, love)
- Save favorite quotes
- Create and submit their own quotes
- Rate submitted quotes

All data is managed via Firebase, with a custom API built using Firebase Cloud Functions handling quote retrieval and interactions.

---

## Frameworks & Technologies

- **React Native** – Building the mobile app interface.
- **Firebase**
  - Authentication
  - Firestore for data persistence
  - Cloud Functions for hosting the custom API
- **TypeScript** – 

---

## API Usage

The custom API (via Firebase Cloud Functions) includes the following endpoints:

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

A simplified file tree is as follows:
daily-quote/
├── .expo/                 
│   └── ...                # Expo-specific configuration files
├── .expo-shared/          
│   └── ...                # Shared Expo metadata/configuration
├── assets/                
│   ├── adaptive-icon.png  # Adaptive icon for different screen sizes
│   ├── favicon.png        # Favicon image
│   ├── icon.png           # App icon
│   └── splash.png         # Splash screen image
├── node_modules/          
│   └── ...                # Node.js dependencies (auto-generated)
├── src/                   
│   ├── components/        # Reusable UI components (e.g., buttons, headers)
│   │   └── ...            
│   ├── contexts/          # React context providers for state management
│   │   └── ...            
│   ├── firebase/          # Firebase initialization and configuration files
│   │   └── ...            
│   ├── navigation/        # Navigation configuration (navigators for routes)
│   │   ├── DailyQuoteNavigator.ts
│   │   ├── ExploreQuotesNavigator.ts
│   │   └── QuoteDetailsNavigator.ts
│   ├── screens/           # Screen components representing app views
│   │   ├── Home.tsx
│   │   ├── OneDayQuoteSelector.ts
│   │   └── ...            # Other screens (e.g., RateQuote.ts)
│   ├── store/             # Redux or similar state management store files
│   │   └── ...            
│   ├── utils/             # Helper functions and utility modules
│   │   └── ...            
│   ├── index.ts           # Main entry point for the app source code
│   └── ...                # Additional source files, if any
├── .gitignore             # Files to ignore in Git
├── app.json               # Expo configuration file
├── babel.config.js        # Babel configuration for JavaScript/TypeScript
├── firebase.json          # Firebase configuration (hosting, functions, etc.)
├── package-lock.json      # Auto-generated lock file for npm packages
├── package.json           # Project metadata, dependencies, and scripts
├── README.md              # Project documentation (this file)
└── tsconfig.json          # TypeScript configuration file


