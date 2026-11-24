import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, ScreenContainer, AppHeader } from '../../../components';

export const ProfileScreen: React.FC = () => {
  return (
    <ScreenContainer withTopInset>
      <AppHeader title="Profile & Settings" />
      <View style={styles.container}>
        <AppText variant="screenTitle">Profile</AppText>
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
