export interface SportCategory {
  idSport: string;
  strSport: string;
  strFormat?: string;
  strSportThumb?: string;
  strSportDescription?: string;
}

export interface SportLeague {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate?: string;
}

export interface Team {
  idTeam: string;
  strTeam: string;
  strTeamShort?: string;
  strAlternate?: string;
  intFormedYear?: string;
  strSport: string;
  strLeague?: string;
  idLeague?: string;
  strDivision?: string;
  strManager?: string;
  strStadium?: string;
  strKeywords?: string;
  strStadiumThumb?: string;
  strStadiumDescription?: string;
  strStadiumLocation?: string;
  intStadiumCapacity?: string;
  strWebsite?: string;
  strFacebook?: string;
  strTwitter?: string;
  strInstagram?: string;
  strDescriptionEN?: string;
  strCountry?: string;
  strTeamBadge?: string;
  strBadge?: string;
  strTeamJersey?: string;
  strTeamLogo?: string;
  strTeamFanart1?: string;
  strTeamBanner?: string;
  cachedAt?: number;
}

export interface SportsListCache {
  league: string;
  sport: string;
  teams: Team[];
  timestamp: number;
}

export interface TeamDetailsCache {
  [teamId: string]: {
    team: Team;
    timestamp: number;
  };
}
