import { CustomerData } from '../types/customer';

export function generateSampleData(count: number): CustomerData[] {
  const data: CustomerData[] = [];
  
  for (let i = 0; i < count; i++) {
    // Generate different customer segments with realistic patterns
    const segment = Math.random();
    
    let recency: number;
    let frequency: number;
    let monetary: number;
    
    if (segment < 0.2) {
      // VIP Customers - Recent, frequent, high value
      recency = Math.floor(Math.random() * 30) + 1;
      frequency = Math.floor(Math.random() * 20) + 15;
      monetary = Math.floor(Math.random() * 5000) + 2000;
    } else if (segment < 0.4) {
      // Regular Customers - Moderate activity
      recency = Math.floor(Math.random() * 60) + 30;
      frequency = Math.floor(Math.random() * 10) + 5;
      monetary = Math.floor(Math.random() * 1500) + 500;
    } else if (segment < 0.6) {
      // New Customers - Recent but low activity
      recency = Math.floor(Math.random() * 30) + 1;
      frequency = Math.floor(Math.random() * 3) + 1;
      monetary = Math.floor(Math.random() * 500) + 50;
    } else if (segment < 0.8) {
      // At-Risk Customers - Not recent but had some activity
      recency = Math.floor(Math.random() * 180) + 90;
      frequency = Math.floor(Math.random() * 8) + 3;
      monetary = Math.floor(Math.random() * 1200) + 300;
    } else {
      // Dormant Customers - Very old, low activity
      recency = Math.floor(Math.random() * 200) + 180;
      frequency = Math.floor(Math.random() * 5) + 1;
      monetary = Math.floor(Math.random() * 800) + 100;
    }
    
    data.push({
      customerId: `CUST_${(i + 1).toString().padStart(6, '0')}`,
      recency,
      frequency,
      monetary
    });
  }
  
  return data;
}