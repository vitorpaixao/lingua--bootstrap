import React, { createContext, useContext, useState } from 'react';
import { HELPXP_ITEMS } from './helpxp.config';

interface SelectedContext {
  id: string;
  title: string;
  context: string;
}

interface HelpXPContextValue {
  active: boolean;
  openId: string | null;
  toggle: () => void;
  open: (id: string) => void;
  close: () => void;
  selectedContext: SelectedContext | null;
  selectContext: (id: string) => void;
  clearContext: () => void;
}

const HelpXPContext = createContext<HelpXPContextValue | null>(null);

export function HelpXPProvider({
  children,
  onOpenHelp,
}: {
  children: React.ReactNode;
  onOpenHelp?: () => void;
}) {
  const [active, setActive] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [selectedContext, setSelectedContext] = useState<SelectedContext | null>(null);

  const toggle = () => {
    setActive((a) => !a);
    setOpenId(null);
  };

  const open = (id: string) => {
    setActive(true);
    setOpenId(id);
  };

  const close = () => setOpenId(null);

  const selectContext = (id: string) => {
    const item = HELPXP_ITEMS[id];
    if (!item) return;
    setSelectedContext({ id, title: item.title, context: item.context ?? item.content });
    setOpenId(null);
    onOpenHelp?.();
  };

  const clearContext = () => setSelectedContext(null);

  return (
    <HelpXPContext.Provider
      value={{ active, openId, toggle, open, close, selectedContext, selectContext, clearContext }}
    >
      {children}
    </HelpXPContext.Provider>
  );
}

export function useHelpXP() {
  const ctx = useContext(HelpXPContext);
  if (!ctx) throw new Error('useHelpXP must be used within HelpXPProvider');
  return ctx;
}
