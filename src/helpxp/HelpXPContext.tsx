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
  selectedContexts: SelectedContext[];
  selectContext: (id: string) => void;
  removeContext: (id: string) => void;
  clearAllContexts: () => void;
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
  const [selectedContexts, setSelectedContexts] = useState<SelectedContext[]>([]);

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
    setSelectedContexts((prev) =>
      prev.some((c) => c.id === id)
        ? prev
        : [...prev, { id, title: item.title, context: item.context ?? item.content }]
    );
    setOpenId(null);
    onOpenHelp?.();
  };

  const removeContext = (id: string) =>
    setSelectedContexts((prev) => prev.filter((c) => c.id !== id));

  const clearAllContexts = () => setSelectedContexts([]);

  return (
    <HelpXPContext.Provider
      value={{ active, openId, toggle, open, close, selectedContexts, selectContext, removeContext, clearAllContexts }}
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
