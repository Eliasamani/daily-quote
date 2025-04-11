// src/presenters/CreateQuotesPresenter.ts
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { logoutUser } from "../store/slices/authSlice";
import { useNavigation, StackNavigationProp } from "@react-navigation/native";
import { auth } from "../config/firebase";
import { db } from "../config/firebase"; // import Firestore instance
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

type DashboardStackParamList = {
  CreateQuotes: undefined;
};

export function useCreateQuotesPresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<StackNavigationProp<DashboardStackParamList, "CreateQuotes">>();

  // Navigation and logout functions
  const onLogout = () => dispatch(logoutUser());
  const onLogoPress = () => navigation.goBack();

  // Submit quote function using Firestore
  const submitQuote = async (quote: string, author: string, tags: string[]) => {
    const userId = auth.currentUser?.uid;

    console.log("auth.currentUser:", auth.currentUser);


    if (!userId) {
      alert("User not authenticated");
      return;
    }

    // Build your quote object. You can add more fields like a timestamp.
    const newQuote = {
      content: quote,
      author,
      tags,
      createdBy: userId,
      createdAt: serverTimestamp(), // use Firestore's server timestamp
    };

    try {
      // Add the document to the "quotes" collection
      const docRef = await addDoc(collection(db, "quotes"), newQuote);
      alert("Your quote has been submitted successfully!");

      navigation.goBack();
    } catch (error) {
      console.error("Error submitting quote:", error);
      alert("Failed to submit quote");
    }
  };

  return { onLogout, onLogoPress, submitQuote };
}
