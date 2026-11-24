import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../../theme';

export interface FavouriteButtonProps {
  isFavourite: boolean;
  onToggle: () => void;
  size?: number;
  style?: ViewStyle;
}

export const FavouriteButton: React.FC<FavouriteButtonProps> = ({
  isFavourite,
  onToggle,
  size = 20,
  style,
}) => {
  const { colors } = useTheme();

  const heartColor = isFavourite ? colors.error : colors.textSecondary;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onToggle}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
      accessibilityState={{ selected: isFavourite }}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      style={[
        styles.button,
        {
          backgroundColor: isFavourite ? colors.error + '18' : colors.surface,
          borderColor: isFavourite ? colors.error + '40' : colors.border,
        },
        style,
      ]}>
      <Feather
        name={isFavourite ? 'heart' : 'heart'}
        size={size}
        color={heartColor}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
