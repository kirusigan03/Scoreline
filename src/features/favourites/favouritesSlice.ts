import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Team } from '../sports/types';

export interface FavouritesState {
  items: Team[];
  userScopedId: string | null;
}

const initialState: FavouritesState = {
  items: [],
  userScopedId: null,
};

export const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    setUserScopedFavourites: (
      state,
      action: PayloadAction<{ userScopedId: string; items: Team[] }>
    ) => {
      state.userScopedId = action.payload.userScopedId;
      state.items = action.payload.items;
    },
    toggleFavourite: (state, action: PayloadAction<Team>) => {
      const existsIndex = state.items.findIndex(
        (item) => item.idTeam === action.payload.idTeam
      );
      if (existsIndex >= 0) {
        state.items.splice(existsIndex, 1);
      } else {
        // Prevent duplicate entries
        state.items.push(action.payload);
      }
    },
    removeFavouriteById: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.idTeam !== action.payload);
    },
    clearUserFavourites: (state) => {
      state.items = [];
      state.userScopedId = null;
    },
  },
});

export const {
  setUserScopedFavourites,
  toggleFavourite,
  removeFavouriteById,
  clearUserFavourites,
} = favouritesSlice.actions;

export default favouritesSlice.reducer;
