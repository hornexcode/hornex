import { GameId } from '@/lib/models/Account';
import React, { createContext, ReactNode } from 'react';

export const GameIDContext = createContext<{
  gameIds: GameId[];
}>({
  gameIds: [],
});

export type GameIDContextProviderProps = {
  children: ReactNode;
  gameIds: GameId[];
};

export const GameIDContextProvider = ({
  children,
  gameIds,
}: GameIDContextProviderProps) => {
  return (
    <GameIDContext.Provider
      value={{
        gameIds,
      }}
    >
      {children}
    </GameIDContext.Provider>
  );
};

export const useGameId = () => {
  const context = React.useContext(GameIDContext);
  if (context === undefined) {
    throw new Error('useGameId must be used within a GameIDContext');
  }
  return context;
};
