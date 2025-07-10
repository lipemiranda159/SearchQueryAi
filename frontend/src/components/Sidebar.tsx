import React from 'react';
import { FileUp, GitPullRequest, Code, Settings, MessageSquare } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'config', label: 'Configuration', icon: Settings },
    { id: 'query-search', label: 'Consultas SQL', icon: MessageSquare },
    { id: 'files', label: 'File Manager', icon: FileUp },
    { id: 'pullrequests', label: 'Pull Requests', icon: GitPullRequest },
    { id: 'api', label: 'API Calls', icon: Code }
  ];

  return (
    <div className="w-72 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">SQL Query Assistant</h1>
        <p className="text-sm text-gray-600 mt-1">Consultas inteligentes para Databricks</p>
      </div>
      
      <nav className="mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;