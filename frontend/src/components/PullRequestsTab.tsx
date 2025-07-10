import React, { useState } from 'react';
import { Plus, ExternalLink, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { PullRequest } from '../types';

interface PullRequestsTabProps {
  pullRequests: PullRequest[];
  onCreatePullRequest: (pr: Omit<PullRequest, 'id' | 'status'>) => void;
}

const PullRequestsTab: React.FC<PullRequestsTabProps> = ({ pullRequests, onCreatePullRequest }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sourceBranch: '',
    targetBranch: 'main'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreatePullRequest(formData);
    setFormData({ title: '', description: '', sourceBranch: '', targetBranch: 'main' });
    setShowForm(false);
  };

  const getStatusIcon = (status: PullRequest['status']) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
      case 'creating':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'created':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Pull Requests</h2>
          <p className="text-sm text-gray-600">Manage your pull requests and create new ones.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New PR
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-md font-medium text-gray-900 mb-4">Create Pull Request</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Branch
                </label>
                <input
                  type="text"
                  value={formData.sourceBranch}
                  onChange={(e) => setFormData({ ...formData, sourceBranch: e.target.value })}
                  required
                  placeholder="feature/my-feature"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Branch
                </label>
                <input
                  type="text"
                  value={formData.targetBranch}
                  onChange={(e) => setFormData({ ...formData, targetBranch: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Pull Request
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {pullRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No pull requests yet. Create your first one!</p>
          </div>
        ) : (
          pullRequests.map((pr) => (
            <div key={pr.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(pr.status)}
                <div>
                  <p className="font-medium text-gray-900">{pr.title}</p>
                  <p className="text-sm text-gray-600">
                    {pr.sourceBranch} → {pr.targetBranch}
                    {pr.prNumber && ` • PR #${pr.prNumber}`}
                  </p>
                  {pr.error && (
                    <p className="text-sm text-red-600">{pr.error}</p>
                  )}
                </div>
              </div>
              {pr.url && (
                <a
                  href={pr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-1 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View PR
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PullRequestsTab;