import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FavouritesStackParamList } from './types';
import { FavouritesScreen } from '../features/favourites/screens/FavouritesScreen';
import { TeamDetailsScreen } from '../features/sports/screens/TeamDetailsScreen';

const Stack = createNativeStackNavigator<FavouritesStackParamList>();

export const FavouritesNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Favourites" component={FavouritesScreen} />
      <Stack.Screen name="TeamDetails" component={TeamDetailsScreen} />
    </Stack.Navigator>
  );
};
