import React, { useState } from 'react';
import { Bubble, Sender, useXAgent, useXChat } from '@ant-design/x';
import { Alert, Flex, Divider, Tag } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { Client } from '@langchain/langgraph-sdk';
import { HelpXPTrigger } from '../helpxp/HelpXPTrigger';
import { useHelpXP } from '../helpxp/HelpXPContext';

const LANGGRAPH_URL = import.meta.env.VITE_LANGGRAPH_URL ?? `http://${window.location.hostname}:8765`;
const client = new Client({ apiUrl: LANGGRAPH_URL });

export const HelpChat: React.FC = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const { selectedContexts, removeContext, clearAllContexts } = useHelpXP();

  const [agent] = useXAgent({
    request: async ({ message }, { onUpdate, onSuccess, onError }) => {
      setErrorMsg(null);
      try {
        const thread = await client.threads.create();
        const stream = client.runs.stream(thread.thread_id, 'agent', {
          input: { messages: [{ role: 'human', content: message }] },
          streamMode: 'messages',
        });
        let full = '';
        for await (const chunk of stream) {
          if (chunk.event === 'messages/partial' && Array.isArray(chunk.data)) {
            for (const msg of chunk.data as Array<{ type?: string; content?: unknown }>) {
              if (msg.type === 'ai') {
                const text = typeof msg.content === 'string' ? msg.content : '';
                if (text) {
                  full = text;
                  onUpdate(full);
                }
              }
            }
          }
        }
        if (!full) {
          onError(new Error('Agent returned empty response'));
        } else {
          onSuccess(full);
        }
      } catch (e) {
        const err = e as Error;
        const msg =
          err.message.includes('Failed to fetch') || err.message.includes('ERR_CONNECTION_REFUSED')
            ? 'Agent server not reachable. Start Docker: cd lingua--helper-agent && docker compose up'
            : err.message;
        setErrorMsg(msg);
        onError(err);
      }
    },
  });

  const { onRequest, messages } = useXChat({ agent });

  const handleSubmit = (msg: string) => {
    const prefix = selectedContexts
      .map((c) => `[Context: ${c.title}]\n${c.context}`)
      .join('\n\n');
    const augmented = prefix ? `${prefix}\n\nUser: ${msg}` : msg;
    onRequest(augmented);
    clearAllContexts();
    setInputValue('');
  };

  return (
    <Flex vertical style={{ height: '100%', padding: 8 }}>
      <Flex align="center" gap={8} style={{ marginBottom: 4 }}>
        <HelpXPTrigger />
        <span style={{ fontSize: 12, opacity: 0.6 }}>Highlight UI elements</span>
      </Flex>
      <Divider style={{ margin: '4px 0' }} />
      <Bubble.List
        style={{ flex: 1, overflow: 'auto' }}
        items={messages.map((m) => {
          let content = m.message;
          if (m.status === 'local' && content.startsWith('[Context:')) {
            const userMarker = '\n\nUser: ';
            const idx = content.lastIndexOf(userMarker);
            if (idx !== -1) content = content.slice(idx + userMarker.length);
          }
          return { role: m.status === 'local' ? 'user' : 'assistant', content };
        })}
      />
      {errorMsg && (
        <Alert
          type="error"
          message={errorMsg}
          closable
          onClose={() => setErrorMsg(null)}
          style={{ marginTop: 8 }}
        />
      )}
      <Sender
        header={
          selectedContexts.length > 0 ? (
            <Flex wrap="wrap" gap={4} style={{ padding: '4px 0 0 4px' }}>
              {selectedContexts.map((c) => (
                <Tag
                  key={c.id}
                  closable
                  onClose={() => removeContext(c.id)}
                  icon={<RobotOutlined />}
                  color="orange"
                >
                  {c.title}
                </Tag>
              ))}
            </Flex>
          ) : undefined
        }
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSubmit}
        style={{ marginTop: 8, borderRadius: 4 }}
      />
    </Flex>
  );
};
