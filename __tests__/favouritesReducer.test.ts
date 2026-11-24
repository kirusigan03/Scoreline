import favouritesReducer, {
  toggleFavourite,
  removeFavouriteById,
  setUserScopedFavourites,
  clearUserFavourites,
} from '../src/features/favourites/favouritesSlice';
import { Team } from '../src/features/sports/types';

describe('Favourites Reducer and Isolation', () => {
  const sampleTeam1: Team = {
    idTeam: '133604',
    strTeam: 'Arsenal',
    strSport: 'Soccer',
    strLeague: 'English Premier League',
    strCountry: 'England',
  };

  const sampleTeam2: Team = {
    idTeam: '133612',
    strTeam: 'Manchester United',
    strSport: 'Soccer',
    strLeague: 'English Premier League',
    strCountry: 'England',
  };

  it('should add a team to favourites when not already present', () => {
    const initialState = { items: [], userScopedId: 'emilys' };
    const nextState = favouritesReducer(initialState, toggleFavourite(sampleTeam1));

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].idTeam).toBe('133604');
    expect(nextState.items[0].strTeam).toBe('Arsenal');
  });

  it('should remove a team when toggled again (prevent duplicates)', () => {
    const initialState = { items: [sampleTeam1], userScopedId: 'emilys' };
    const nextState = favouritesReducer(initialState, toggleFavourite(sampleTeam1));

    expect(nextState.items).toHaveLength(0);
  });

  it('should remove favourite by ID', () => {
    const initialState = { items: [sampleTeam1, sampleTeam2], userScopedId: 'emilys' };
    const nextState = favouritesReducer(initialState, removeFavouriteById('133604'));

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].idTeam).toBe('133612');
  });

  it('should isolate favourites when setting user-scoped favourites', () => {
    const user1State = { items: [], userScopedId: null };
    const loadedState = favouritesReducer(
      user1State,
      setUserScopedFavourites({
        userScopedId: 'emilys',
        items: [sampleTeam1],
      })
    );

    expect(loadedState.userScopedId).toBe('emilys');
    expect(loadedState.items).toHaveLength(1);

    // When logging out or clearing
    const clearedState = favouritesReducer(loadedState, clearUserFavourites());
    expect(clearedState.items).toHaveLength(0);
    expect(clearedState.userScopedId).toBeNull();
  });
});
