import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, ScreenContainer, AppHeader } from '../../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'TeamDetails'>;

export const TeamDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { teamId, teamName } = route.params;

  return (
    <ScreenContainer withTopInset>
      <AppHeader
        showBack
        onBack={() => navigation.goBack()}
        title={teamName || 'Team Details'}
      />
      <View style={styles.container}>
        <AppText variant="sectionTitle">Team #{teamId}</AppText>
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
