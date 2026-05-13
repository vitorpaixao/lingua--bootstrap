import React from 'react';
import { Button, Flex, Popover } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { useHelpXP } from './HelpXPContext';
import { HELPXP_ITEMS } from './helpxp.config';

interface Props {
  id: string;
  children: React.ReactNode;
  block?: boolean;
}

export function HelpXPTarget({ id, children, block }: Props) {
  const { active, openId, open, close, selectContext } = useHelpXP();
  const step = HELPXP_ITEMS[id];

  if (!active || !step) return <>{children}</>;

  return (
    <Popover
      open={openId === id}
      onOpenChange={(v) => { if (!v) close(); }}
      placement={step.placement ?? 'top'}
      title={step.title}
      content={
        <div style={{ maxWidth: 240 }}>
          <p style={{ margin: '0 0 10px' }}>{step.content}</p>
          <Flex justify="space-between">
            <Button size="small" onClick={close}>Got it</Button>
            <Button
              size="small"
              type="primary"
              icon={<RobotOutlined />}
              onClick={() => selectContext(id)}
            >
              Ask AI
            </Button>
          </Flex>
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
