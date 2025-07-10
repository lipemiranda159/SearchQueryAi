import { useState, useCallback } from 'react';
import { ApiCall } from '../types';

export const useApiCalls = () => {
  const [apiCalls, setApiCalls] = useState<ApiCall[]>([]);

  const executeApiCall = useCallback(async (callData: Omit<ApiCall, 'id' | 'status' | 'timestamp'>) => {
    const apiCall: ApiCall = {
      ...callData,
      id: Date.now().toString(),
      status: 'pending',
      timestamp: Date.now()
    };
    
    setApiCalls(prev => [apiCall, ...prev]);
    
    setApiCalls(prev => prev.map(call => 
      call.id === apiCall.id ? { ...call, status: 'executing' } : call
    ));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResponse = {
        status: 200,
        data: { message: 'API call executed successfully', timestamp: new Date().toISOString() },
        headers: { 'content-type': 'application/json' }
      };
      
      setApiCalls(prev => prev.map(call => 
        call.id === apiCall.id ? { ...call, status: 'success', response: mockResponse } : call
      ));
    } catch (error) {
      setApiCalls(prev => prev.map(call => 
        call.id === apiCall.id ? { ...call, status: 'error', error: 'API call failed' } : call
      ));
    }
  }, []);

  const removeApiCall = useCallback((callId: string) => {
    setApiCalls(prev => prev.filter(call => call.id !== callId));
  }, []);

  const clearHistory = useCallback(() => {
    setApiCalls([]);
  }, []);

  return {
    apiCalls,
    executeApiCall,
    removeApiCall,
    clearHistory
  };
};