import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebase';

export function useCreateQuotesPresenter() {
  const navigation = useNavigation();

  const submitQuote = async (quote, author, tags) => {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      alert("User not authenticated");
      return;
    }

    const newQuote = { content: quote, author, tags, createdBy: userId };

    try {
      const response = await fetch("https://<your-cloud-function-url>/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuote),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quote");
      }

      alert("Quote submitted!");
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting quote:", error);
      alert("Failed to submit quote");
    }
  };

  return {
    submitQuote,
  };
}
