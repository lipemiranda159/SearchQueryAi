export interface AzureDevOpsConfig {
  organization: string;
  project: string;
  repository: string;
  personalAccessToken: string;
}

export interface FileUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string;
  path: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface PullRequest {
  id: string;
  title: string;
  description: string;
  sourceBranch: string;
  targetBranch: string;
  status: 'pending' | 'creating' | 'created' | 'error';
  prNumber?: number;
  url?: string;
  error?: string;
}

export interface ApiCall {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  headers: Record<string, string>;
  body?: string;
  status: 'pending' | 'executing' | 'success' | 'error';
  response?: any;
  error?: string;
  timestamp: number;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: number;
  queryResult?: QuerySearchResult;
  isTyping?: boolean;
}

export interface QuerySearchResult {
  id: number;
  name: string;
  tags: string[] | null;
  description: string;
  query: string;
  score: number;
  geminiResult: any;
}