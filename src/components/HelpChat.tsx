import React, { useState } from 'react';
import { Bubble, Sender, useXAgent, useXChat } from '@ant-design/x';
import { Alert, Flex, Divider, Tag } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { Client } from '@langchain/langgraph-sdk';
import { HelpXPTrigger } from '../helpxp/HelpXPTrigger';
import { useHelpXP } from '../helpxp/HelpXPContext';

const LANGGRAPH_URL = import.meta.env.VITE_LANGGRAPH_URL ?? 'http://localhost:8765';
const client = new Client({ apiUrl: LANGGRAPH_URL });

export const HelpChat: React.FC = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const { selectedContext, clearContext } = useHelpXP();

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
            ? 'Agent server not reachable. Run: cd lingua--helper-agent && uv run langgraph dev (port 2024)'
            : err.message;
        setErrorMsg(msg);
        onError(err);
      }
    },
  });

  const { onRequest, messages } = useXChat({ agent });

  const handleSubmit = (msg: string) => {
    const augmented = selectedContext
      ? `[Context: ${selectedContext.title}]\n${selectedContext.context}\n\nUser: ${msg}`
      : msg;
    onRequest(augmented);
    clearContext();
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
        items={messages.map((m) => ({
          role: m.status === 'local' ? 'user' : 'assistant',
          content: m.message,
        }))}
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
          selectedContext ? (
            <Tag
              closable
              onClose={clearContext}
              icon={<RobotOutlined />}
              color="orange"
              style={{ margin: '4px 0 0 4px' }}
            >
              {selectedContext.title}
            </Tag>
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
