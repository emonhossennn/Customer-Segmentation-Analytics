import React, { useState } from 'react';
import { Upload, FileText, Database, AlertCircle } from 'lucide-react';
import { CustomerData } from '../types/customer';

interface DataUploadProps {
  onDataUpload: (data: CustomerData[]) => void;
  onGenerateSample: () => void;
}

const DataUpload: React.FC<DataUploadProps> = ({ onDataUpload, onGenerateSample }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setErrorMessage('Please upload a CSV file');
      setUploadStatus('error');
      return;
    }

    setUploadStatus('processing');
    setErrorMessage('');

    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      // Expected headers: customer_id, recency, frequency, monetary
      const requiredHeaders = ['customerid', 'recency', 'frequency', 'monetary'];
      const missingHeaders = requiredHeaders.filter(h => !headers.some(header => header.includes(h.replace('_', ''))));
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
      }

      const data: CustomerData[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= 4) {
          data.push({
            customerId: values[0]?.trim() || `CUST_${i}`,
            recency: parseFloat(values[1]) || 0,
            frequency: parseFloat(values[2]) || 0,
            monetary: parseFloat(values[3]) || 0,
          });
        }
      }

      if (data.length === 0) {
        throw new Error('No valid data rows found');
      }

      setUploadStatus('success');
      onDataUpload(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to process file');
      setUploadStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Customer Data</h2>
          <p className="text-gray-600">
            Upload your customer data CSV file or generate sample data to get started with customer segmentation analysis.
          </p>
        </div>

        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ${
            isDragOver
              ? 'border-blue-400 bg-blue-50'
              : uploadStatus === 'success'
              ? 'border-green-400 bg-green-50'
              : uploadStatus === 'error'
              ? 'border-red-400 bg-red-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploadStatus === 'processing' ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
              <p className="text-gray-600">Processing your file...</p>
            </div>
          ) : uploadStatus === 'success' ? (
            <div className="flex flex-col items-center text-green-600">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <p className="font-medium">File uploaded successfully!</p>
            </div>
          ) : uploadStatus === 'error' ? (
            <div className="flex flex-col items-center text-red-600">
              <AlertCircle className="w-12 h-12 mb-4" />
              <p className="font-medium mb-2">Upload failed</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drag and drop your CSV file here
              </p>
              <p className="text-gray-500 mb-4">or</p>
              <label className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors cursor-pointer">
                Browse Files
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />
              </label>
            </div>
          )}
        </div>

        {/* CSV Format Requirements */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">CSV Format Requirements</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>Your CSV file should contain the following columns:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>customer_id</strong>: Unique identifier for each customer</li>
              <li><strong>recency</strong>: Days since last purchase</li>
              <li><strong>frequency</strong>: Total number of purchases</li>
              <li><strong>monetary</strong>: Total amount spent by customer</li>
            </ul>
            <p className="mt-3 text-xs text-gray-500">
              Example: customer_id,recency,frequency,monetary<br/>
              CUST_001,15,8,1250.50
            </p>
          </div>
        </div>

        {/* Generate Sample Data */}
        <div className="mt-8 text-center">
          <div className="border-t border-gray-200 pt-8">
            <p className="text-gray-600 mb-4">
              Don't have data ready? Generate sample customer data to explore the analytics features.
            </p>
            <button
              onClick={onGenerateSample}
              className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:from-teal-600 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Generate Sample Data (1,000 customers)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataUpload;