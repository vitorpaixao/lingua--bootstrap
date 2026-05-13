import React, { createContext, useContext, useState } from 'react';

interface HelpXPContextValue {
  active: boolean;
  openId: string | null;
  toggle: () => void;
  open: (id: string) => void;
  close: () => void;
}

const HelpXPContext = createContext<HelpXPContextValue | null>(null);

export function HelpXPProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = () => {
    setActive((a) => !a);
    setOpenId(null);
  };

  const open = (id: string) => {
    setActive(true);
    setOpenId(id);
  };

  const close = () => setOpenId(null);

  return (
    <HelpXPContext.Provider value={{ active, openId, toggle, open, close }}>
      {children}
    </HelpXPContext.Provider>
  );
}

export function useHelpXP() {
  const ctx = useContext(HelpXPContext);
  if (!ctx) throw new Error('useHelpXP must be used within HelpXPProvider');
  return ctx;
}
