import React, { useState } from 'react';
import { BarChart3, TrendingUp, PieChart, Info } from 'lucide-react';
import { ClusterResults } from '../types/customer';

interface ClusteringResultsProps {
  clusterResults: ClusterResults;
}

const ClusteringResults: React.FC<ClusteringResultsProps> = ({ clusterResults }) => {
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);

  const ScatterPlot = () => {
    const maxRecency = Math.max(...clusterResults.clusters.flatMap(c => c.customers.map(cust => cust.recency)));
    const maxMonetary = Math.max(...clusterResults.clusters.flatMap(c => c.customers.map(cust => cust.monetary)));
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Segments Visualization</h3>
        <div className="relative w-full h-96 bg-gray-50 rounded-lg overflow-hidden">
          {/* Axes */}
          <div className="absolute bottom-0 left-0 w-full h-full">
            {/* Y-axis label */}
            <div className="absolute left-2 top-1/2 transform -rotate-90 -translate-y-1/2 text-sm font-medium text-gray-600">
              Monetary Value ($)
            </div>
            
            {/* X-axis label */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-600">
              Recency (Days)
            </div>
            
            {/* Plot area */}
            <div className="ml-12 mb-8 mr-4 mt-4 relative w-full h-full">
              {clusterResults.clusters.map((cluster) => (
                <g key={cluster.id}>
                  {cluster.customers.slice(0, 100).map((customer, idx) => { // Limit points for performance
                    const x = (customer.recency / maxRecency) * 100;
                    const y = 100 - (customer.monetary / maxMonetary) * 100;
                    
                    return (
                      <div
                        key={idx}
                        className="absolute w-2 h-2 rounded-full opacity-70 hover:opacity-100 transition-opacity"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          backgroundColor: cluster.profile.color,
                        }}
                        title={`${cluster.profile.name}: R:${customer.recency}, M:$${customer.monetary}`}
                      />
                    );
                  })}
                  
                  {/* Cluster center */}
                  <div
                    className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg"
                    style={{
                      left: `${(cluster.center.recency / maxRecency) * 100}%`,
                      top: `${100 - (cluster.center.monetary / maxMonetary) * 100}%`,
                      backgroundColor: cluster.profile.color,
                    }}
                    title={`${cluster.profile.name} Center`}
                  />
                </g>
              ))}
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4">
          {clusterResults.clusters.map((cluster) => (
            <div key={cluster.id} className="flex items-center">
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: cluster.profile.color }}
              ></div>
              <span className="text-sm text-gray-700">{cluster.profile.name}</span>
              <span className="text-sm text-gray-500 ml-1">({cluster.size})</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ElbowChart = () => {
    const maxInertia = Math.max(...clusterResults.elbowData.map(d => d.inertia));
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Elbow Method - Optimal K Selection</h3>
        <div className="relative w-full h-64 bg-gray-50 rounded-lg p-4">
          <svg className="w-full h-full">
            {/* Draw lines */}
            {clusterResults.elbowData.map((point, idx) => {
              if (idx === 0) return null;
              const prevPoint = clusterResults.elbowData[idx - 1];
              const x1 = ((prevPoint.k - 2) / (clusterResults.elbowData.length - 1)) * 100;
              const y1 = 100 - (prevPoint.inertia / maxInertia) * 80;
              const x2 = ((point.k - 2) / (clusterResults.elbowData.length - 1)) * 100;
              const y2 = 100 - (point.inertia / maxInertia) * 80;
              
              return (
                <line
                  key={idx}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke="#3B82F6"
                  strokeWidth="2"
                />
              );
            })}
            
            {/* Draw points */}
            {clusterResults.elbowData.map((point, idx) => {
              const x = ((point.k - 2) / (clusterResults.elbowData.length - 1)) * 100;
              const y = 100 - (point.inertia / maxInertia) * 80;
              
              return (
                <circle
                  key={idx}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="4"
                  fill="#3B82F6"
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
          
          {/* X-axis labels */}
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            {clusterResults.elbowData.map(point => (
              <span key={point.k}>K={point.k}</span>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          The elbow method helps determine the optimal number of clusters by identifying the point where adding more clusters yields diminishing returns.
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <PieChart className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Clusters Found</p>
              <p className="text-2xl font-bold text-gray-900">{clusterResults.clusters.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-teal-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Silhouette Score</p>
              <p className="text-2xl font-bold text-gray-900">{clusterResults.silhouetteScore.toFixed(3)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-orange-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Inertia</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(clusterResults.totalInertia)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScatterPlot />
        <ElbowChart />
      </div>

      {/* Cluster Summary Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Cluster Summary</h3>
          <p className="text-sm text-gray-600 mt-1">Key characteristics of each customer segment</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Segment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Recency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Frequency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Monetary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clusterResults.clusters.map((cluster, index) => (
                <tr 
                  key={cluster.id} 
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 cursor-pointer transition-colors`}
                  onClick={() => setSelectedCluster(selectedCluster === cluster.id ? null : cluster.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: cluster.profile.color }}
                      ></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{cluster.profile.name}</div>
                        <div className="text-sm text-gray-500">{cluster.profile.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {cluster.size} ({((cluster.size / clusterResults.clusters.reduce((sum, c) => sum + c.size, 0)) * 100).toFixed(1)}%)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {Math.round(cluster.center.recency)} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {Math.round(cluster.center.frequency)} orders
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    ${Math.round(cluster.center.monetary).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cluster.profile.priority === 'High' 
                        ? 'bg-red-100 text-red-800'
                        : cluster.profile.priority === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {cluster.profile.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Cluster Information */}
      {selectedCluster !== null && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Info className="w-5 h-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              {clusterResults.clusters.find(c => c.id === selectedCluster)?.profile.name} Details
            </h3>
          </div>
          
          {(() => {
            const cluster = clusterResults.clusters.find(c => c.id === selectedCluster);
            if (!cluster) return null;
            
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Characteristics</h4>
                  <ul className="space-y-2">
                    {cluster.profile.characteristics.map((char, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{char}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Marketing Strategy</h4>
                  <ul className="space-y-2">
                    {cluster.profile.marketingStrategy.map((strategy, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default ClusteringResults;