"use client";

import { useEffect, useState, useRef } from "react";
import {
  HumanMessage,
  SystemMessage,
  BaseMessage,
  AIMessage,
  mapChatMessagesToStoredMessages,
} from "@langchain/core/messages";
import { message } from "./actions";
import { seed } from "./database";

export default function Home() {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<BaseMessage[]>([
    new SystemMessage(`
      You are an expert SQL assistant. Your task is to generate SQL queries based on user requests. Follow these strict formatting guidelines:
        
      You should create a SQLite query based on natural language. 
      Use the "getFromDB" tool to get data from a database.

      - Always enclose field names and table names in double quotes ("), even if they contain no special characters.
      - Ensure proper SQL syntax and use best practices for readability.
      - Maintain consistency in capitalization (e.g., SQL keywords in uppercase).
    `),
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    seed();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function sendMessage() {
    setIsLoading(true); // set to true
    const messageHistory = [...messages, new HumanMessage(inputMessage)];

    const response = await message(
      mapChatMessagesToStoredMessages(messageHistory)
    );

    if (response) {
      messageHistory.push(new AIMessage(response as string));
    }

    setMessages(messageHistory);
    setInputMessage("");
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Text-to-SQL Agent</h1>
              <p className="text-sm text-gray-600">Convert natural language to SQL queries</p>
            </div>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
            {messages.length === 1 && (
              <div className="text-center py-12">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to SQL Agent</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Ask me anything about your database! I can help you write SQL queries using natural language.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    &quot;Show me all customers&quot;
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    &quot;Top 5 orders by value&quot;
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    &quot;Orders from last month&quot;
                  </span>
                </div>
              </div>
            )}
            {messages.slice(1).map((msg, index) => {
              if (msg instanceof HumanMessage) {
                return (
                  <div key={msg.getType() + index} className="flex justify-end">
                    <div className="flex items-start space-x-3 max-w-3xl">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl px-4 py-3 shadow-lg">
                        <p className="text-sm font-medium">{msg.content as string}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              if (msg instanceof AIMessage) {
                return (
                  <div key={msg.getType() + index} className="flex justify-start">
                    <div className="flex items-start space-x-3 max-w-3xl">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl px-4 py-3 shadow-lg border border-gray-200">
                        <div className="text-sm text-gray-800 whitespace-pre-wrap">{msg.content as string}</div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-3xl">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-lg border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-gray-500">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  disabled={isLoading}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && inputMessage.trim()) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Ask me about your database... (e.g., 'Show me all customers')"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <kbd className="inline-flex items-center px-2 py-1 border border-gray-200 rounded text-xs font-mono bg-gray-50 text-gray-500">
                    ⏎
                  </kbd>
                </div>
              </div>
            </div>
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed rounded-xl text-white transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          <div className="mt-2 flex items-center justify-center">
            <p className="text-xs text-gray-500">
              Ask questions like: &quot;Show top customers&quot;, &quot;Recent orders&quot;, &quot;Sales by month&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}