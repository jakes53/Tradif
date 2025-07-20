// BotLogContext.tsx
import React, { createContext, useState, useContext } from "react";

const BotLogContext = createContext<{
  logs: string[];
  pushLog: (msg: string) => void;
}>({
  logs: [],
  pushLog: () => {},
});

export const BotLogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<string[]>([]);

  const pushLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
    const line = `[${timestamp}] ${msg}`;
    setLogs((prev) => [...prev, line]);
  };

  return (
    <BotLogContext.Provider value={{ logs, pushLog }}>
      {children}
    </BotLogContext.Provider>
  );
};

export const useBotLogs = () => useContext(BotLogContext);
