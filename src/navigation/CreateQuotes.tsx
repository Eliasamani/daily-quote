// navigation/CreateQuotesNavigator.js
import { createStackNavigator } from '@react-navigation/stack';
import CreateQuotesScreen from '../screens/CreateQuotesScreen';

const Stack = createStackNavigator();

export default function CreateQuotesNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CreateQuotes"
        component={CreateQuotesScreen}
      />
      {/* add more screens if needed, e.g., a Confirm screen */}
    </Stack.Navigator>
  );
}
