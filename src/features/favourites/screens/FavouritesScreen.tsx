import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, ScreenContainer, AppHeader } from '../../../components';

export const FavouritesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <ScreenContainer withTopInset>
      <AppHeader title="Your Favourites" />
      <View style={styles.container}>
        <AppText variant="screenTitle">Favourites</AppText>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
