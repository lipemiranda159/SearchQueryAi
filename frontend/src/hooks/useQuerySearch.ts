import { useState, useCallback } from 'react';
import { ChatMessage, QuerySearchResult } from '../types';

export const useQuerySearch = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Olá! Sou seu assistente de consultas SQL. Como posso ajudá-lo hoje? Descreva o que você precisa consultar e eu encontrarei a query mais adequada para você.',
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: '',
      timestamp: Date.now(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      // Simulate API call to QuerySearch endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response based on the provided example
      const mockResponse: QuerySearchResult = {
        id: 0,
        name: "notificationErrors.sql",
        tags: ["incident", "builder", "messages", "notifications"],
        description: "Retorna as mensagens que apresentaram erro, filtrando por identidade e data de armazenamento.",
        query: `-- name: Notification Errors
-- tags: incident, builder, messages, notifications
-- description: Retorna as mensagens que apresentaram erro, filtrando por identidade e data de armazenamento.
SELECT DISTINCT 
    messages.storageDateBR AS \`Data e Hora (GMT-3)\`, 
    notifications.Event AS Event, 
    translate(decode(unbase64(content), "ISO-8859-1"), "\\0\\n", "") AS \`Mensagem que apresentou erro\`, 
    notifications.ReasonDescription AS \`Descrição do erro\`, 
    messages.id AS \`ID da mensagem que falhou\`, 
    messages.FromIdentity, 
    messages.ToIdentity
FROM querying.messages AS messages
LEFT JOIN querying.notifications AS notifications ON messages.id = notifications.id
WHERE 1=1
    AND :identity IN (messages.FromIdentity,messages.ToIdentity)
    AND notifications.StorageDateDayBr = :StorageDateBR
    AND messages.storageDateBR >= :StorageDateBRStart
    AND messages.storageDateBR <= :StorageDateBREnd
    AND notifications.Event = 'failed'`,
        score: 0.7887561,
        geminiResult: null
      };

      // Remove typing indicator and add bot response
      setMessages(prev => {
        const withoutTyping = prev.filter(msg => !msg.isTyping);
        const botResponse: ChatMessage = {
          id: (Date.now() + 2).toString(),
          type: 'bot',
          content: `Encontrei uma query que pode ajudar! Esta consulta retorna mensagens com erro de notificação, filtrando por identidade e data. A relevância é de ${(mockResponse.score * 100).toFixed(1)}%.`,
          timestamp: Date.now(),
          queryResult: mockResponse
        };
        return [...withoutTyping, botResponse];
      });
    } catch (error) {
      setMessages(prev => {
        const withoutTyping = prev.filter(msg => !msg.isTyping);
        const errorMessage: ChatMessage = {
          id: (Date.now() + 2).toString(),
          type: 'bot',
          content: 'Desculpe, ocorreu um erro ao buscar a consulta. Tente novamente.',
          timestamp: Date.now()
        };
        return [...withoutTyping, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: 'Olá! Sou seu assistente de consultas SQL. Como posso ajudá-lo hoje? Descreva o que você precisa consultar e eu encontrarei a query mais adequada para você.',
        timestamp: Date.now()
      }
    ]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat
  };
};