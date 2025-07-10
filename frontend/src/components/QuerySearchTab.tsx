import React, { useState, useRef, useEffect } from 'react';
import { Send, Copy, Check, Bot, User, Trash2, Code, Tag, Clock } from 'lucide-react';
import { ChatMessage } from '../types';
import { useQuerySearch } from '../hooks/useQuerySearch';

const QuerySearchTab: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, sendMessage, clearChat } = useQuerySearch();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      sendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const copyToClipboard = async (text: string, queryId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedQuery(queryId);
      setTimeout(() => setCopiedQuery(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderMessage = (message: ChatMessage) => {
    if (message.isTyping) {
      return (
        <div className="flex items-start space-x-3 mb-6">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3 max-w-3xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={message.id} className={`flex items-start space-x-3 mb-6 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          message.type === 'user' ? 'bg-green-600' : 'bg-blue-600'
        }`}>
          {message.type === 'user' ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <Bot className="h-4 w-4 text-white" />
          )}
        </div>
        
        <div className="flex-1">
          <div className={`rounded-2xl px-4 py-3 max-w-3xl ${
            message.type === 'user' 
              ? 'bg-green-600 text-white rounded-tr-md ml-auto' 
              : 'bg-gray-100 text-gray-900 rounded-tl-md'
          }`}>
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
          
          <div className={`flex items-center mt-1 text-xs text-gray-500 ${message.type === 'user' ? 'justify-end' : ''}`}>
            <Clock className="h-3 w-3 mr-1" />
            {formatTimestamp(message.timestamp)}
          </div>

          {message.queryResult && (
            <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Code className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-900">{message.queryResult.name}</span>
                    <span className="text-sm text-green-600 font-medium">
                      {(message.queryResult.score * 100).toFixed(1)}% relevância
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(message.queryResult!.query, message.id)}
                    className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    {copiedQuery === message.id ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        Copiar Query
                      </>
                    )}
                  </button>
                </div>
                
                {message.queryResult.tags && (
                  <div className="flex items-center mt-2 space-x-1">
                    <Tag className="h-3 w-3 text-gray-500" />
                    <div className="flex flex-wrap gap-1">
                      {message.queryResult.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-3">{message.queryResult.description}</p>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-100 font-mono leading-relaxed">
                    {message.queryResult.query}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-2rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Assistente de Consultas SQL</h2>
          <p className="text-sm text-gray-600">Descreva sua necessidade e receba queries otimizadas para Databricks</p>
        </div>
        <button
          onClick={clearChat}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Limpar Chat
        </button>
      </div>

      <div className="flex-1 bg-white rounded-lg border border-gray-200 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Descreva o que você precisa consultar..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setInputMessage('Gostaria de uma consulta para validação de notificações com erro')}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              Notificações com erro
            </button>
            <button
              onClick={() => setInputMessage('Preciso consultar mensagens por período')}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              Mensagens por período
            </button>
            <button
              onClick={() => setInputMessage('Como consultar logs de sistema?')}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              Logs de sistema
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuerySearchTab;