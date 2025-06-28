import React, { useState, useEffect } from 'react';
import { Upload, BarChart3, Users, TrendingUp, Target, Download } from 'lucide-react';
import Dashboard from './components/Dashboard';
import DataUpload from './components/DataUpload';
import ClusteringResults from './components/ClusteringResults';
import CustomerProfiles from './components/CustomerProfiles';
import { CustomerData, ClusterResults } from './types/customer';
import { generateSampleData } from './utils/dataGenerator';
import { performKMeansAnalysis } from './utils/clustering';

function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'dashboard' | 'clusters' | 'profiles'>('upload');
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [clusterResults, setClusterResults] = useState<ClusterResults | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDataUpload = (data: CustomerData[]) => {
    setCustomerData(data);
    setActiveTab('dashboard');
  };

  const generateSampleDataHandler = () => {
    const sampleData = generateSampleData(1000);
    setCustomerData(sampleData);
    setActiveTab('dashboard');
  };

  const runClustering = async () => {
    if (customerData.length === 0) return;
    
    setIsProcessing(true);
    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      const results = performKMeansAnalysis(customerData);
      setClusterResults(results);
      setActiveTab('clusters');
    } catch (error) {
      console.error('Clustering failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const tabs = [
    { id: 'upload' as const, label: 'Data Upload', icon: Upload },
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3, disabled: customerData.length === 0 },
    { id: 'clusters' as const, label: 'Clustering Results', icon: TrendingUp, disabled: !clusterResults },
    { id: 'profiles' as const, label: 'Customer Profiles', icon: Users, disabled: !clusterResults },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Customer Segmentation Analytics <span className="text-blue-500">by Emon</span></h1>
              <p className="text-gray-600 mt-1">K-Means Clustering for Targeted Marketing — Personalized by Emon</p>
            </div>
          </div>
          
          {/* Stats Summary */}
          {customerData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{customerData.length.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-teal-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Avg Order Value</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${(customerData.reduce((sum, c) => sum + c.monetary, 0) / customerData.length).toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <BarChart3 className="w-8 h-8 text-orange-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${(customerData.reduce((sum, c) => sum + c.monetary, 0)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Segments</p>
                    <p className="text-2xl font-bold text-gray-900">{clusterResults ? clusterResults.clusters.length : '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => !tab.disabled && setActiveTab(tab.id)}
                  disabled={tab.disabled}
                  className={`flex items-center px-6 py-4 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : tab.disabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        {customerData.length > 0 && !clusterResults && activeTab === 'dashboard' && (
          <div className="mb-6">
            <button
              onClick={runClustering}
              disabled={isProcessing}
              className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Processing Clusters...
                </div>
              ) : (
                'Run K-Means Analysis'
              )}
            </button>
          </div>
        )}

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'upload' && (
            <DataUpload 
              onDataUpload={handleDataUpload}
              onGenerateSample={generateSampleDataHandler}
            />
          )}
          
          {activeTab === 'dashboard' && customerData.length > 0 && (
            <Dashboard customerData={customerData} />
          )}
          
          {activeTab === 'clusters' && clusterResults && (
            <ClusteringResults clusterResults={clusterResults} />
          )}
          
          {activeTab === 'profiles' && clusterResults && (
            <CustomerProfiles clusterResults={clusterResults} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;