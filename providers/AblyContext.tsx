"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ablyClient } from "@/lib/ably.client";

type AblyContextType = {
  subscribe: (channelName: string, eventName: string, callback: (message: any) => void) => () => void;
};

const AblyContext = createContext<AblyContextType | undefined>(undefined);

export const AblyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const subscribe = (channelName: string, eventName: string, callback: (message: any) => void) => {
    const channel = ablyClient.channels.get(channelName);

    channel.subscribe(eventName, callback);

    return () => {
      channel.unsubscribe(eventName, callback);
    };
  };

  return <AblyContext.Provider value={{ subscribe }}>{children}</AblyContext.Provider>;
};

export const useAbly = () => {
  const context = useContext(AblyContext);
  if (!context) {
    throw new Error("useAbly must be used within an AblyProvider");
  }
  return context;
};
