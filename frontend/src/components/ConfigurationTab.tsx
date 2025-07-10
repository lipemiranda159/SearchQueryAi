import React from 'react';
import { Save, TestTube } from 'lucide-react';
import { AzureDevOpsConfig } from '../types';

interface ConfigurationTabProps {
  config: AzureDevOpsConfig;
  onUpdateConfig: (config: Partial<AzureDevOpsConfig>) => void;
  onTest: () => void;
}

const ConfigurationTab: React.FC<ConfigurationTabProps> = ({ config, onUpdateConfig, onTest }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Azure DevOps Configuration</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            Configure your Azure DevOps connection settings. You'll need a Personal Access Token with appropriate permissions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization
          </label>
          <input
            type="text"
            value={config.organization}
            onChange={(e) => onUpdateConfig({ organization: e.target.value })}
            placeholder="your-organization"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project
          </label>
          <input
            type="text"
            value={config.project}
            onChange={(e) => onUpdateConfig({ project: e.target.value })}
            placeholder="your-project"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Repository
          </label>
          <input
            type="text"
            value={config.repository}
            onChange={(e) => onUpdateConfig({ repository: e.target.value })}
            placeholder="your-repository"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Personal Access Token
          </label>
          <input
            type="password"
            value={config.personalAccessToken}
            onChange={(e) => onUpdateConfig({ personalAccessToken: e.target.value })}
            placeholder="••••••••••••••••"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onTest}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          <TestTube className="h-4 w-4 mr-2" />
          Test Connection
        </button>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          <Save className="h-4 w-4 mr-2" />
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default ConfigurationTab;