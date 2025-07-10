import { useState, useCallback } from 'react';
import { AzureDevOpsConfig, FileUpload, PullRequest } from '../types';

export const useAzureDevOps = () => {
  const [config, setConfig] = useState<AzureDevOpsConfig>({
    organization: '',
    project: '',
    repository: '',
    personalAccessToken: ''
  });

  const [files, setFiles] = useState<FileUpload[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);

  const updateConfig = useCallback((newConfig: Partial<AzureDevOpsConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const addFile = useCallback((file: File, path: string) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileUpload: FileUpload = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        content: e.target?.result as string,
        path,
        status: 'pending'
      };
      setFiles(prev => [...prev, fileUpload]);
    };
    reader.readAsDataURL(file);
  }, []);

  const uploadFile = useCallback(async (fileId: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: 'uploading' } : f
    ));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'success' } : f
      ));
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'error', error: 'Upload failed' } : f
      ));
    }
  }, []);

  const createPullRequest = useCallback(async (prData: Omit<PullRequest, 'id' | 'status'>) => {
    const pr: PullRequest = {
      ...prData,
      id: Date.now().toString(),
      status: 'pending'
    };
    
    setPullRequests(prev => [...prev, pr]);
    
    setPullRequests(prev => prev.map(p => 
      p.id === pr.id ? { ...p, status: 'creating' } : p
    ));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setPullRequests(prev => prev.map(p => 
        p.id === pr.id ? { 
          ...p, 
          status: 'created', 
          prNumber: Math.floor(Math.random() * 1000) + 1,
          url: `https://dev.azure.com/${config.organization}/${config.project}/_git/${config.repository}/pullrequest/${Math.floor(Math.random() * 1000) + 1}`
        } : p
      ));
    } catch (error) {
      setPullRequests(prev => prev.map(p => 
        p.id === pr.id ? { ...p, status: 'error', error: 'Failed to create PR' } : p
      ));
    }
  }, [config]);

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  return {
    config,
    updateConfig,
    files,
    addFile,
    uploadFile,
    removeFile,
    pullRequests,
    createPullRequest
  };
};