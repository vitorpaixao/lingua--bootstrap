import React from 'react';
import { Tooltip } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useHelpXP } from './HelpXPContext';

export function HelpXPTrigger() {
  const { active, toggle } = useHelpXP();
  return (
    <Tooltip title={active ? 'Exit help mode' : 'Show contextual help'}>
      <span
        onClick={toggle}
        style={{
          cursor: 'pointer',
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
          color: active ? '#fa8c16' : undefined,
        }}
      >
        {active ? <BulbFilled /> : <BulbOutlined />}
      </span>
    </Tooltip>
  );
}
