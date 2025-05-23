
export default {
    expo: {
        name: 'daily-quote',
        slug: 'daily-quote',
        version: '1.0.0',
        assetBundlePatterns: ["**/*"],
        orientation: 'portrait',
        icon: './assets/icon.png',
        userInterfaceStyle: 'light',
        newArchEnabled: true,
        splash: {
            image: './assets/splash-icon.png',
            resizeMode: 'contain',
            backgroundColor: '#ffffff',
        },
        ios: {
            supportsTablet: true,
        },
        android: {

            adaptiveIcon: {
                foregroundImage: './assets/adaptive-icon.png',
                backgroundColor: '#ffffff',
            },
            package: 'com.anonymous.dailyquote',
        },
        web: {
            favicon: './assets/favicon.png',
        },
        extra: {
            FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
            FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
            FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
            FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
            FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
            FIREBASE_MEASUREMENT_ID: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
        },
    },
};