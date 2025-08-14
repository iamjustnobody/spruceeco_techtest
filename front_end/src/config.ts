export const config = {
  enableLocalHostApiCalls: true,
  apiBaseUrl: "http://localhost:4000/api",
};
export const APIs = {
  getPlayerStats: (username: string) =>
    `${config.apiBaseUrl}/players/stats/${username}`,
  savePlayer: () => `${config.apiBaseUrl}/players/player`,
  // getMatchHistory: (username:string) => `${config.apiBaseUrl}/matches/history/${username}`,
  saveMatch: () => `${config.apiBaseUrl}/matches/match`,
};
