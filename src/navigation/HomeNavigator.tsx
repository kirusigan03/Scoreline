import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';
import { HomeScreen } from '../features/sports/screens/HomeScreen';
import { TeamDetailsScreen } from '../features/sports/screens/TeamDetailsScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="TeamDetails" component={TeamDetailsScreen} />
    </Stack.Navigator>
  );
};
