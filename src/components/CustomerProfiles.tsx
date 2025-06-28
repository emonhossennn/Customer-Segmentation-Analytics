import React, { useState } from 'react';
import { Users, Target, TrendingUp, DollarSign, Calendar, ShoppingBag, AlertTriangle, Star } from 'lucide-react';
import { ClusterResults } from '../types/customer';

interface CustomerProfilesProps {
  clusterResults: ClusterResults;
}

const CustomerProfiles: React.FC<CustomerProfilesProps> = ({ clusterResults }) => {
  const [selectedCluster, setSelectedCluster] = useState<number>(0);

  const getIcon = (segmentName: string) => {
    switch (segmentName) {
      case 'Champions':
        return <Star className="w-6 h-6" />;
      case 'Loyal Customers':
        return <Users className="w-6 h-6" />;
      case 'New Customers':
        return <TrendingUp className="w-6 h-6" />;
      case 'At-Risk Customers':
        return <AlertTriangle className="w-6 h-6" />;
      default:
        return <Users className="w-6 h-6" />;
    }
  };

  const selectedClusterData = clusterResults.clusters[selectedCluster];

  return (
    <div className="space-y-6">
      {/* Cluster Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Segments Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {clusterResults.clusters.map((cluster, index) => (
            <button
              key={cluster.id}
              onClick={() => setSelectedCluster(index)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedCluster === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-white"
                  style={{ backgroundColor: cluster.profile.color }}
                >
                  {getIcon(cluster.profile.name)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{cluster.profile.name}</h3>
                  <p className="text-sm text-gray-600">{cluster.size} customers</p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Click to view detailed profile
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Cluster Profile */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div 
          className="p-6 text-white"
          style={{ backgroundColor: selectedClusterData.profile.color }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                {getIcon(selectedClusterData.profile.name)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedClusterData.profile.name}</h2>
                <p className="text-white text-opacity-80">{selectedClusterData.profile.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{selectedClusterData.size}</div>
              <div className="text-white text-opacity-80">customers</div>
              <div className="text-sm text-white text-opacity-60">
                {((selectedClusterData.size / clusterResults.clusters.reduce((sum, c) => sum + c.size, 0)) * 100).toFixed(1)}% of total
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{Math.round(selectedClusterData.center.recency)}</div>
              <div className="text-sm text-gray-600">Avg Days Since Purchase</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <ShoppingBag className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{Math.round(selectedClusterData.center.frequency)}</div>
              <div className="text-sm text-gray-600">Avg Purchase Frequency</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">${Math.round(selectedClusterData.center.monetary).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Avg Total Spent</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Target className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{selectedClusterData.profile.priority}</div>
              <div className="text-sm text-gray-600">Marketing Priority</div>
            </div>
          </div>

          {/* Characteristics and Strategy */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-gray-600" />
                Customer Characteristics
              </h3>
              <div className="space-y-3">
                {selectedClusterData.profile.characteristics.map((characteristic, index) => (
                  <div key={index} className="flex items-start">
                    <div 
                      className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                      style={{ backgroundColor: selectedClusterData.profile.color }}
                    ></div>
                    <p className="text-gray-700">{characteristic}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-gray-600" />
                Marketing Strategy
              </h3>
              <div className="space-y-3">
                {selectedClusterData.profile.marketingStrategy.map((strategy, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700">{strategy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sample Customers */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Customers</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recency
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Frequency
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monetary
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedClusterData.customers.slice(0, 10).map((customer, index) => (
                    <tr key={customer.customerId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {customer.customerId}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {customer.recency} days
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {customer.frequency} orders
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        ${customer.monetary.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selectedClusterData.customers.length > 10 && (
              <p className="text-sm text-gray-500 mt-3">
                Showing 10 of {selectedClusterData.customers.length} customers in this segment
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Recommendations */}
      <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-600" />
          Recommended Next Steps for {selectedClusterData.profile.name}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-gray-900 mb-2">Immediate Actions</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              {selectedClusterData.profile.marketingStrategy.map((action, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-gray-900 mb-2">Success Metrics to Track</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li className="flex items-start">
                <span className="text-teal-500 mr-2">•</span>
                Conversion rate from marketing campaigns
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2">•</span>
                Average order value increase
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2">•</span>
                Customer lifetime value growth
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2">•</span>
                Retention rate improvement
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfiles;