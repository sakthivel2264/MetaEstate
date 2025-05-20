"use client";

import React, { useEffect, useRef, useState } from 'react';

const FloatingAIRealEstateAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello! I’m MetaEstate AI Agent 👋 — your expert guide in the Metaverse Real Estate Marketplace. Ask me anything about virtual properties, blockchain transactions, or smart contracts.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const assistantMessage = { role: 'assistant', content: '' };

    const updatedMessages = [...messages, userMessage, assistantMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000' || "https://metaestate.vercel.app/",
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct',
          stream: true,
          messages: [
            {
              role: 'system',
              content: `You are MetaEstate AI Agent, a professional assistant for a MetaEstate app.
              You ONLY respond to topics involving:
              - Virtual property listings
              - Blockchain-based property transactions
              - Smart contracts
              - Metaverse user experiences
              - Marketplace platform features

              DO NOT respond to questions unrelated to metaverse real estate or blockchain applications.`,
            },
            ...updatedMessages.slice(0, -1), // exclude empty assistant message
          ],
        }),
      });

      if (!res.body) throw new Error('No response stream');

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let finalMessage = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk
          .split('\n')
          .filter(line => line.trim().startsWith('data: '))
          .map(line => line.replace(/^data: /, ''));

        for (const line of lines) {
          if (line === '[DONE]') break;

          try {
            const json = JSON.parse(line);
            const token = json.choices?.[0]?.delta?.content;
            if (token) {
              finalMessage += token;
              setMessages(prev =>
                prev.map((msg, i) =>
                  i === prev.length - 1
                    ? { ...msg, content: finalMessage }
                    : msg
                )
              );
            }
          } catch (e) {
            console.warn('Could not parse line', line);
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          role: 'assistant',
          content: 'Sorry, something went wrong while contacting the AI Agent.',
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="fixed bottom-10 right-10 z-50">
      <button
        onClick={toggleChat}
        className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition"
      >
        🤖
      </button>

      {isOpen && (
        <div className="w-xl h-96 bg-white border rounded-lg shadow-lg flex flex-col p-3 mt-2">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">MetaEstate AI Agent</h2>
            <button
              onClick={toggleChat}
              className="text-gray-500 hover:text-gray-700"
            >
              ✖️
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 mb-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`text-sm p-2 rounded ${
                  msg.role === 'user'
                    ? 'bg-purple-100 text-right ml-auto'
                    : 'bg-gray-100 mr-auto'
                }`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 border rounded px-2 py-1 text-sm"
              placeholder="Ask about virtual real estate..."
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-purple-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingAIRealEstateAgent;
