export interface CustomerData {
  customerId: string;
  recency: number;      // Days since last purchase
  frequency: number;    // Number of purchases
  monetary: number;     // Total spent
  cluster?: number;     // Assigned cluster
}

export interface ClusterCenter {
  recency: number;
  frequency: number;
  monetary: number;
}

export interface ClusterInfo {
  id: number;
  center: ClusterCenter;
  size: number;
  customers: CustomerData[];
  profile: {
    name: string;
    description: string;
    characteristics: string[];
    marketingStrategy: string[];
    color: string;
    priority: 'High' | 'Medium' | 'Low';
  };
}

export interface ClusterResults {
  clusters: ClusterInfo[];
  totalInertia: number;
  silhouetteScore: number;
  elbowData: { k: number; inertia: number }[];
}