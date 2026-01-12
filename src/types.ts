export type PackageType = 'deep-work' | 'light-work' | 'fun-work' | 'test';

export interface Customer {
  id: string;
  cardNumber: string;
  packageType: PackageType;
  startTime: Date;
  endTime: Date;
  checkedOut: boolean;
  checkoutTime?: Date; // Thời gian checkout thực tế
}

export interface Package {
  type: PackageType;
  name: string;
  hours: number;
  price: number;
  description: string;
}

export const PACKAGES: Package[] = [
  {
    type: 'deep-work',
    name: 'Deep Work',
    hours: 4,
    price: 0,
    description: '4 giờ + 1 nước'
  },
  {
    type: 'light-work',
    name: 'Light Work',
    hours: 3,
    price: 0,
    description: '3 giờ + nước'
  },
  {
    type: 'fun-work',
    name: 'Fun Work',
    hours: 1,
    price: 0,
    description: '1 giờ + 1 nước'
  },
  {
    type: 'test',
    name: 'Test',
    hours: 10 / 60, // 10 phút = 0.167 giờ
    price: 0,
    description: '10 phút + 1 nước'
  }
];

export const OVERTIME_RATE = 15000; // 15k per hour

