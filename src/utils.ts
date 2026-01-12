import { Customer, OVERTIME_RATE } from './types';

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('vi-VN', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function calculateElapsedHours(startTime: Date, endTime?: Date): number {
  const end = endTime || new Date();
  const diffMs = end.getTime() - startTime.getTime();
  return diffMs / (1000 * 60 * 60); // Convert to hours
}

/**
 * Tính số giờ quá giờ (làm tròn lên đến giờ gần nhất)
 * Ví dụ: quá 1 giờ 1 phút = 2 giờ, quá 2 giờ 30 phút = 3 giờ
 */
export function calculateOvertimeHours(customer: Customer, packageHours: number): number {
  // Nếu đã checkout, sử dụng checkoutTime, nếu không thì dùng thời gian hiện tại
  const elapsedHours = calculateElapsedHours(customer.startTime, customer.checkoutTime);
  const overtimeHours = elapsedHours - packageHours;
  
  if (overtimeHours <= 0) {
    return 0;
  }
  
  // Làm tròn lên đến giờ gần nhất
  // Ví dụ: 1.01 giờ = 2 giờ, 2.5 giờ = 3 giờ
  return Math.ceil(overtimeHours);
}

/**
 * Tính phí quá giờ: mỗi giờ quá = 15,000 VNĐ
 * Tính theo từng giờ một cách độc lập (làm tròn lên)
 */
export function calculateOvertimeFee(customer: Customer, packageHours: number): number {
  const overtimeHours = calculateOvertimeHours(customer, packageHours);
  return overtimeHours * OVERTIME_RATE;
}

/**
 * Tính số tiền phải trả thêm cho mỗi giờ quá giờ
 * Trả về mảng các giờ và số tiền tương ứng
 */
export function calculateOvertimeFeePerHour(customer: Customer, packageHours: number): { hour: number; fee: number }[] {
  // Nếu đã checkout, sử dụng checkoutTime, nếu không thì dùng thời gian hiện tại
  const elapsedHours = calculateElapsedHours(customer.startTime, customer.checkoutTime);
  const overtimeHours = elapsedHours - packageHours;
  
  if (overtimeHours <= 0) {
    return [];
  }
  
  const totalOvertimeHours = Math.ceil(overtimeHours);
  const fees: { hour: number; fee: number }[] = [];
  
  for (let i = 1; i <= totalOvertimeHours; i++) {
    fees.push({
      hour: i,
      fee: OVERTIME_RATE
    });
  }
  
  return fees;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}

export function formatDuration(hours: number): string {
  const totalSeconds = Math.floor(hours * 3600);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  
  if (h === 0 && m === 0) {
    return `${s} giây`;
  }
  if (h === 0) {
    return `${m} phút ${s} giây`;
  }
  if (m === 0 && s === 0) {
    return `${h} giờ`;
  }
  if (s === 0) {
    return `${h} giờ ${m} phút`;
  }
  return `${h} giờ ${m} phút ${s} giây`;
}

/**
 * Format duration for remaining time (more compact, shows seconds only when < 1 minute)
 */
export function formatRemainingTime(hours: number): string {
  const totalSeconds = Math.floor(hours * 3600);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  
  if (h === 0 && m === 0) {
    return `${s}s`;
  }
  if (h === 0) {
    return `${m}m ${s}s`;
  }
  if (m === 0 && s === 0) {
    return `${h}h`;
  }
  if (s === 0) {
    return `${h}h ${m}m`;
  }
  return `${h}h ${m}m ${s}s`;
}

