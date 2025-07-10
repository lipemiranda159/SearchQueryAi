import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { FileUpload } from '../types';

interface FileManagerTabProps {
  files: FileUpload[];
  onAddFile: (file: File, path: string) => void;
  onUploadFile: (fileId: string) => void;
  onRemoveFile: (fileId: string) => void;
}

const FileManagerTab: React.FC<FileManagerTabProps> = ({ files, onAddFile, onUploadFile, onRemoveFile }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedPath, setSelectedPath] = useState('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onAddFile(file, selectedPath || '/');
    }
  }, [onAddFile, selectedPath]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onAddFile(file, selectedPath || '/');
    }
  }, [onAddFile, selectedPath]);

  const getStatusIcon = (status: FileUpload['status']) => {
    switch (status) {
      case 'pending':
        return <FileText className="h-5 w-5 text-gray-400" />;
      case 'uploading':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">File Manager</h2>
        <p className="text-sm text-gray-600">Upload files to your Azure DevOps repository.</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Path
        </label>
        <input
          type="text"
          value={selectedPath}
          onChange={(e) => setSelectedPath(e.target.value)}
          placeholder="/src/components/"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Drop files here or click to select
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Support for all file types
        </p>
        <input
          type="file"
          onChange={handleFileInput}
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <Upload className="h-4 w-4 mr-2" />
          Select Files
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-md font-medium text-gray-900">Files to Upload</h3>
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(file.status)}
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-600">
                    {file.path} • {(file.size / 1024).toFixed(1)} KB
                  </p>
                  {file.error && (
                    <p className="text-sm text-red-600">{file.error}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {file.status === 'pending' && (
                  <button
                    onClick={() => onUploadFile(file.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Upload
                  </button>
                )}
                <button
                  onClick={() => onRemoveFile(file.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileManagerTab;