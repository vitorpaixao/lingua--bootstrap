import React from 'react';
import { Button, Popover } from 'antd';
import { useHelpXP } from './HelpXPContext';
import { HELPXP_ITEMS } from './helpxp.config';

interface Props {
  id: string;
  children: React.ReactNode;
  block?: boolean;
}

export function HelpXPTarget({ id, children, block }: Props) {
  const { active, openId, open, close } = useHelpXP();
  const step = HELPXP_ITEMS[id];

  if (!active || !step) return <>{children}</>;

  return (
    <Popover
      open={openId === id}
      onOpenChange={(v) => { if (!v) close(); }}
      placement={step.placement ?? 'top'}
      title={step.title}
      content={
        <div style={{ maxWidth: 220 }}>
          <p style={{ margin: '0 0 8px' }}>{step.content}</p>
          <Button size="small" type="primary" onClick={close}>Got it</Button>
        </div>
      }
    >
      <span
        style={{
          position: 'relative',
          display: block ? 'block' : 'inline-block',
          width: block ? '100%' : undefined,
        }}
      >
        {children}
        <span
          className="helpxp-badge"
          onClick={(e) => { e.stopPropagation(); open(id); }}
        />
      </span>
    </Popover>
  );
}
