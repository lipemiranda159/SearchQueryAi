import React, { useState } from 'react';
import { Play, Trash2, CheckCircle, AlertCircle, Loader2, Clock } from 'lucide-react';
import { ApiCall } from '../types';

interface ApiCallsTabProps {
  apiCalls: ApiCall[];
  onExecuteApiCall: (call: Omit<ApiCall, 'id' | 'status' | 'timestamp'>) => void;
  onRemoveApiCall: (callId: string) => void;
  onClearHistory: () => void;
}

const ApiCallsTab: React.FC<ApiCallsTabProps> = ({ 
  apiCalls, 
  onExecuteApiCall, 
  onRemoveApiCall, 
  onClearHistory 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    method: 'GET' as 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: '',
    headers: '{"Content-Type": "application/json"}',
    body: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const headers = JSON.parse(formData.headers);
      onExecuteApiCall({
        ...formData,
        headers,
        body: formData.body || undefined
      });
    } catch (error) {
      alert('Invalid JSON in headers');
    }
  };

  const getStatusIcon = (status: ApiCall['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-400" />;
      case 'executing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">API Calls</h2>
          <p className="text-sm text-gray-600">Execute API calls and view history.</p>
        </div>
        {apiCalls.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear History
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-md font-medium text-gray-900 mb-4">New API Call</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="My API Call"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Method
              </label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
              placeholder="https://api.example.com/endpoint"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Headers (JSON)
            </label>
            <textarea
              value={formData.headers}
              onChange={(e) => setFormData({ ...formData, headers: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            />
          </div>

          {(formData.method === 'POST' || formData.method === 'PUT') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body
              </label>
              <textarea
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              />
            </div>
          )}

          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Play className="h-4 w-4 mr-2" />
            Execute
          </button>
        </form>
      </div>

      <div className="space-y-3">
        <h3 className="text-md font-medium text-gray-900">History</h3>
        {apiCalls.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No API calls yet. Execute your first one!</p>
          </div>
        ) : (
          apiCalls.map((call) => (
            <div key={call.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(call.status)}
                  <div>
                    <p className="font-medium text-gray-900">{call.name}</p>
                    <p className="text-sm text-gray-600">
                      {call.method} {call.url}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(call.timestamp)}</p>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveApiCall(call.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {call.response && (
                <div className="mt-3 p-3 bg-gray-100 rounded border">
                  <p className="text-sm font-medium text-gray-700 mb-2">Response:</p>
                  <pre className="text-xs text-gray-600 overflow-x-auto">
                    {JSON.stringify(call.response, null, 2)}
                  </pre>
                </div>
              )}

              {call.error && (
                <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                  <p className="text-sm font-medium text-red-700 mb-1">Error:</p>
                  <p className="text-sm text-red-600">{call.error}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApiCallsTab;