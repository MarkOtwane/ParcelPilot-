import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HomeComponent {
  features = [
    {
      icon: '📦',
      title: 'Parcel Tracking',
      description: 'Track your parcels in real-time with our advanced tracking system'
    },
    {
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery services across the country'
    },
    {
      icon: '💰',
      title: 'Secure Payments',
      description: 'Safe and secure payment processing for all transactions'
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Access your account and track parcels from any device'
    }
  ];

  testimonials = [
    {
      name: 'John Doe',
      role: 'Business Owner',
      text: 'ParcelPilot has revolutionized how we handle our shipping needs. Fast, reliable, and cost-effective!'
    },
    {
      name: 'Jane Smith',
      role: 'Online Seller',
      text: 'The tracking system is amazing. My customers always know where their packages are.'
    },
    {
      name: 'Mike Johnson',
      role: 'Customer',
      text: 'Best delivery service I\'ve ever used. Highly recommended!'
    }
  ];
} 