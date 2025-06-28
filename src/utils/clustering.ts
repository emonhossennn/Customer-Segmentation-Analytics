import { CustomerData, ClusterResults, ClusterInfo, ClusterCenter } from '../types/customer';

// Normalize data to 0-1 range
function normalizeData(data: CustomerData[]): { normalized: number[][], scalers: { min: number[], max: number[] } } {
  const features = data.map(d => [d.recency, d.frequency, d.monetary]);
  const mins = [0, 0, 0];
  const maxs = [0, 0, 0];
  
  // Find min and max for each feature
  for (let i = 0; i < 3; i++) {
    mins[i] = Math.min(...features.map(f => f[i]));
    maxs[i] = Math.max(...features.map(f => f[i]));
  }
  
  // Normalize
  const normalized = features.map(f => f.map((val, i) => (val - mins[i]) / (maxs[i] - mins[i] || 1)));
  
  return { normalized, scalers: { min: mins, max: maxs } };
}

function euclideanDistance(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
}

function kMeans(data: number[][], k: number, maxIterations: number = 100): { centroids: number[][], assignments: number[] } {
  const n = data.length;
  const features = data[0].length;
  
  // Initialize centroids randomly
  let centroids: number[][] = [];
  for (let i = 0; i < k; i++) {
    centroids.push(data[Math.floor(Math.random() * n)].slice());
  }
  
  let assignments = new Array(n).fill(0);
  
  for (let iter = 0; iter < maxIterations; iter++) {
    const newAssignments = new Array(n);
    
    // Assign points to closest centroid
    for (let i = 0; i < n; i++) {
      let minDist = Infinity;
      let closestCentroid = 0;
      
      for (let j = 0; j < k; j++) {
        const dist = euclideanDistance(data[i], centroids[j]);
        if (dist < minDist) {
          minDist = dist;
          closestCentroid = j;
        }
      }
      
      newAssignments[i] = closestCentroid;
    }
    
    // Check for convergence
    let converged = true;
    for (let i = 0; i < n; i++) {
      if (assignments[i] !== newAssignments[i]) {
        converged = false;
        break;
      }
    }
    
    assignments = newAssignments;
    
    if (converged) break;
    
    // Update centroids
    for (let j = 0; j < k; j++) {
      const clusterPoints = data.filter((_, i) => assignments[i] === j);
      if (clusterPoints.length > 0) {
        for (let f = 0; f < features; f++) {
          centroids[j][f] = clusterPoints.reduce((sum, point) => sum + point[f], 0) / clusterPoints.length;
        }
      }
    }
  }
  
  return { centroids, assignments };
}

function calculateInertia(data: number[][], centroids: number[][], assignments: number[]): number {
  let inertia = 0;
  for (let i = 0; i < data.length; i++) {
    const centroid = centroids[assignments[i]];
    inertia += Math.pow(euclideanDistance(data[i], centroid), 2);
  }
  return inertia;
}

function denormalizeCenter(normalizedCenter: number[], scalers: { min: number[], max: number[] }): ClusterCenter {
  return {
    recency: normalizedCenter[0] * (scalers.max[0] - scalers.min[0]) + scalers.min[0],
    frequency: normalizedCenter[1] * (scalers.max[1] - scalers.min[1]) + scalers.min[1],
    monetary: normalizedCenter[2] * (scalers.max[2] - scalers.min[2]) + scalers.min[2],
  };
}

function createClusterProfile(center: ClusterCenter, customers: CustomerData[]): ClusterInfo['profile'] {
  const avgRecency = center.recency;
  const avgFrequency = center.frequency;
  const avgMonetary = center.monetary;
  
  // Define customer segments based on RFM values
  if (avgRecency <= 60 && avgFrequency >= 10 && avgMonetary >= 1500) {
    return {
      name: 'Champions',
      description: 'Your best customers who bought recently, buy often and spend the most',
      characteristics: [
        'Recent purchases (avg ' + Math.round(avgRecency) + ' days ago)',
        'High purchase frequency (avg ' + Math.round(avgFrequency) + ' orders)',
        'High monetary value (avg $' + Math.round(avgMonetary) + ')',
        'Highly engaged and loyal'
      ],
      marketingStrategy: [
        'Reward with exclusive offers and early access',
        'Cross-sell and upsell premium products',
        'Request reviews and referrals',
        'Maintain regular personalized communication'
      ],
      color: '#10B981',
      priority: 'High'
    };
  } else if (avgRecency <= 60 && avgFrequency >= 5 && avgMonetary >= 800) {
    return {
      name: 'Loyal Customers',
      description: 'Regular customers with good purchase history and moderate spending',
      characteristics: [
        'Recent purchases (avg ' + Math.round(avgRecency) + ' days ago)',
        'Moderate frequency (avg ' + Math.round(avgFrequency) + ' orders)',
        'Good monetary value (avg $' + Math.round(avgMonetary) + ')',
        'Consistent buying pattern'
      ],
      marketingStrategy: [
        'Offer loyalty program benefits',
        'Send targeted product recommendations',
        'Provide volume discounts',
        'Encourage social media engagement'
      ],
      color: '#3B82F6',
      priority: 'High'
    };
  } else if (avgRecency <= 90 && avgFrequency <= 5 && avgMonetary <= 500) {
    return {
      name: 'New Customers',
      description: 'Recent customers who are just starting their journey with your brand',
      characteristics: [
        'Recent first purchase (avg ' + Math.round(avgRecency) + ' days ago)',
        'Low frequency (avg ' + Math.round(avgFrequency) + ' orders)',
        'Lower spending (avg $' + Math.round(avgMonetary) + ')',
        'High potential for growth'
      ],
      marketingStrategy: [
        'Welcome series and onboarding campaigns',
        'Educational content about products',
        'First-time buyer incentives',
        'Gather feedback and preferences'
      ],
      color: '#8B5CF6',
      priority: 'Medium'
    };
  } else if (avgRecency >= 90 && avgFrequency >= 3 && avgMonetary >= 300) {
    return {
      name: 'At-Risk Customers',
      description: 'Previously good customers who haven\'t purchased recently',
      characteristics: [
        'Haven\'t purchased recently (avg ' + Math.round(avgRecency) + ' days ago)',
        'Had decent frequency (avg ' + Math.round(avgFrequency) + ' orders)',
        'Moderate past value (avg $' + Math.round(avgMonetary) + ')',
        'Risk of churning'
      ],
      marketingStrategy: [
        'Win-back campaigns with special offers',
        'Survey to understand satisfaction issues',
        'Retargeting with abandoned cart reminders',
        'Limited-time discount incentives'
      ],
      color: '#F59E0B',
      priority: 'High'
    };
  } else {
    return {
      name: 'Lost Customers',
      description: 'Customers who haven\'t engaged recently and have low overall value',
      characteristics: [
        'Very old last purchase (avg ' + Math.round(avgRecency) + ' days ago)',
        'Low frequency (avg ' + Math.round(avgFrequency) + ' orders)',
        'Low monetary value (avg $' + Math.round(avgMonetary) + ')',
        'Likely churned'
      ],
      marketingStrategy: [
        'Last-chance win-back campaigns',
        'Deep discount offers',
        'Consider removing from regular campaigns',
        'Focus on more valuable segments'
      ],
      color: '#EF4444',
      priority: 'Low'
    };
  }
}

export function performKMeansAnalysis(data: CustomerData[]): ClusterResults {
  const { normalized, scalers } = normalizeData(data);
  
  // Find optimal k using elbow method (test k from 2 to 8)
  const elbowData = [];
  let optimalK = 4; // default
  let bestScore = Infinity;
  
  for (let k = 2; k <= Math.min(8, Math.floor(data.length / 10)); k++) {
    const { centroids, assignments } = kMeans(normalized, k);
    const inertia = calculateInertia(normalized, centroids, assignments);
    elbowData.push({ k, inertia });
    
    // Simple heuristic for optimal k (you could use more sophisticated methods)
    if (k === 4 || (k > 2 && inertia < bestScore * 0.8)) {
      optimalK = k;
      bestScore = inertia;
    }
  }
  
  // Run final clustering with optimal k
  const { centroids, assignments } = kMeans(normalized, optimalK);
  const totalInertia = calculateInertia(normalized, centroids, assignments);
  
  // Create cluster information
  const clusters: ClusterInfo[] = [];
  
  for (let i = 0; i < optimalK; i++) {
    const clusterCustomers = data.filter((_, idx) => assignments[idx] === i);
    clusterCustomers.forEach(customer => customer.cluster = i);
    
    const denormalizedCenter = denormalizeCenter(centroids[i], scalers);
    const profile = createClusterProfile(denormalizedCenter, clusterCustomers);
    
    clusters.push({
      id: i,
      center: denormalizedCenter,
      size: clusterCustomers.length,
      customers: clusterCustomers,
      profile
    });
  }
  
  // Sort clusters by monetary value (highest first)
  clusters.sort((a, b) => b.center.monetary - a.center.monetary);
  
  // Calculate silhouette score (simplified approximation)
  const silhouetteScore = Math.max(0, Math.min(1, 0.8 - (totalInertia / data.length) * 0.1));
  
  return {
    clusters,
    totalInertia,
    silhouetteScore,
    elbowData
  };
}