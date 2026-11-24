import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, ScreenContainer } from '../../../components';
import { useTheme } from '../../../theme';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  return (
    <ScreenContainer withTopInset>
      <View style={styles.container}>
        <AppText variant="screenTitle">Explore Sports</AppText>
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
