import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';
import { CustomerData } from '../types/customer';

interface DashboardProps {
  customerData: CustomerData[];
}

const Dashboard: React.FC<DashboardProps> = ({ customerData }) => {
  // Calculate RFM statistics
  const recencyStats = {
    avg: customerData.reduce((sum, c) => sum + c.recency, 0) / customerData.length,
    min: Math.min(...customerData.map(c => c.recency)),
    max: Math.max(...customerData.map(c => c.recency))
  };

  const frequencyStats = {
    avg: customerData.reduce((sum, c) => sum + c.frequency, 0) / customerData.length,
    min: Math.min(...customerData.map(c => c.frequency)),
    max: Math.max(...customerData.map(c => c.frequency))
  };

  const monetaryStats = {
    avg: customerData.reduce((sum, c) => sum + c.monetary, 0) / customerData.length,
    min: Math.min(...customerData.map(c => c.monetary)),
    max: Math.max(...customerData.map(c => c.monetary))
  };

  // Create distribution data
  const createDistribution = (values: number[], bins: number = 10) => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binSize = (max - min) / bins;
    
    const distribution = Array(bins).fill(0);
    values.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binSize), bins - 1);
      distribution[binIndex]++;
    });
    
    return distribution.map((count, i) => ({
      range: `${Math.round(min + i * binSize)}-${Math.round(min + (i + 1) * binSize)}`,
      count
    }));
  };

  const recencyDist = createDistribution(customerData.map(c => c.recency));
  const frequencyDist = createDistribution(customerData.map(c => c.frequency));
  const monetaryDist = createDistribution(customerData.map(c => c.monetary));

  const DistributionChart = ({ data, title, color }: { data: any[], title: string, color: string }) => {
    const maxCount = Math.max(...data.map(d => d.count));
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title} Distribution</h3>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-20 text-xs text-gray-600 mr-3">{item.range}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                <div
                  className={`h-full ${color} transition-all duration-500 delay-${index * 50}`}
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                ></div>
              </div>
              <div className="w-12 text-xs text-gray-600 text-right ml-3">{item.count}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* RFM Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recency</h3>
                <p className="text-sm text-gray-600">Days since last purchase</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{Math.round(recencyStats.avg)}</p>
              <p className="text-xs text-gray-600">Average</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{recencyStats.min}</p>
              <p className="text-xs text-gray-600">Minimum</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{recencyStats.max}</p>
              <p className="text-xs text-gray-600">Maximum</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Frequency</h3>
                <p className="text-sm text-gray-600">Number of purchases</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{Math.round(frequencyStats.avg)}</p>
              <p className="text-xs text-gray-600">Average</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{frequencyStats.min}</p>
              <p className="text-xs text-gray-600">Minimum</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{frequencyStats.max}</p>
              <p className="text-xs text-gray-600">Maximum</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                <DollarSign className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Monetary</h3>
                <p className="text-sm text-gray-600">Total spent</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">${Math.round(monetaryStats.avg)}</p>
              <p className="text-xs text-gray-600">Average</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${Math.round(monetaryStats.min)}</p>
              <p className="text-xs text-gray-600">Minimum</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${Math.round(monetaryStats.max)}</p>
              <p className="text-xs text-gray-600">Maximum</p>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DistributionChart 
          data={recencyDist} 
          title="Recency" 
          color="bg-gradient-to-r from-red-400 to-red-600" 
        />
        <DistributionChart 
          data={frequencyDist} 
          title="Frequency" 
          color="bg-gradient-to-r from-blue-400 to-blue-600" 
        />
        <DistributionChart 
          data={monetaryDist} 
          title="Monetary" 
          color="bg-gradient-to-r from-teal-400 to-teal-600" 
        />
      </div>

      {/* Data Preview Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Customer Data Preview</h3>
          <p className="text-sm text-gray-600 mt-1">First 10 customers from your dataset</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recency (Days)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frequency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monetary ($)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customerData.slice(0, 10).map((customer, index) => (
                <tr key={customer.customerId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.customerId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {customer.recency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {customer.frequency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    ${customer.monetary.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;