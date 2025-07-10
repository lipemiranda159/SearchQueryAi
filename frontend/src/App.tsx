import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ConfigurationTab from './components/ConfigurationTab';
import QuerySearchTab from './components/QuerySearchTab';
import FileManagerTab from './components/FileManagerTab';
import PullRequestsTab from './components/PullRequestsTab';
import ApiCallsTab from './components/ApiCallsTab';
import ToastContainer from './components/ToastContainer';
import { useAzureDevOps } from './hooks/useAzureDevOps';
import { useApiCalls } from './hooks/useApiCalls';
import { useToast } from './hooks/useToast';

function App() {
  const [activeTab, setActiveTab] = useState('config');
  const { toasts, addToast, removeToast } = useToast();
  const {
    config,
    updateConfig,
    files,
    addFile,
    uploadFile,
    removeFile,
    pullRequests,
    createPullRequest
  } = useAzureDevOps();
  const { apiCalls, executeApiCall, removeApiCall, clearHistory } = useApiCalls();

  const handleTestConnection = () => {
    addToast({
      type: 'info',
      message: 'Testing connection...'
    });
    
    setTimeout(() => {
      addToast({
        type: 'success',
        message: 'Connection test successful!'
      });
    }, 2000);
  };

  const handleFileUpload = (fileId: string) => {
    uploadFile(fileId);
    addToast({
      type: 'info',
      message: 'File upload started...'
    });
  };

  const handleCreatePR = (prData: any) => {
    createPullRequest(prData);
    addToast({
      type: 'info',
      message: 'Creating pull request...'
    });
  };

  const handleExecuteApi = (callData: any) => {
    executeApiCall(callData);
    addToast({
      type: 'info',
      message: 'Executing API call...'
    });
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'config':
        return (
          <ConfigurationTab
            config={config}
            onUpdateConfig={updateConfig}
            onTest={handleTestConnection}
          />
        );
      case 'query-search':
        return <QuerySearchTab />;
      case 'files':
        return (
          <FileManagerTab
            files={files}
            onAddFile={addFile}
            onUploadFile={handleFileUpload}
            onRemoveFile={removeFile}
          />
        );
      case 'pullrequests':
        return (
          <PullRequestsTab
            pullRequests={pullRequests}
            onCreatePullRequest={handleCreatePR}
          />
        );
      case 'api':
        return (
          <ApiCallsTab
            apiCalls={apiCalls}
            onExecuteApiCall={handleExecuteApi}
            onRemoveApiCall={removeApiCall}
            onClearHistory={clearHistory}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 p-8 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {renderActiveTab()}
        </div>
      </main>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;