type MatchmakingEventType = "MatchmakingSucceeded";

type MatchmakingEvent = {
  detail: {
    tickets: {
      ticketId: string;
      startTime: string;
      players: {
        playerId: string;
        team: string;
      }[];
    }[];
    type: MatchmakingEventType;
    gameSessionInfo: {
      players: {
        playerId: string;
        playerSessionId?: string;
        team: string;
      }[];
    };
    matchId?: string;
  };
};
