import { useEffect, useState } from 'react';
import { Customer, PACKAGES } from '../types';
import { formatTime, formatDate, calculateElapsedHours, calculateOvertimeHours, calculateOvertimeFee, calculateOvertimeFeePerHour, formatCurrency, formatDuration, formatRemainingTime } from '../utils';
import { Clock, CreditCard, LogOut, Trash2 } from 'lucide-react';
import './CustomerCard.css';

interface CustomerCardProps {
  customer: Customer;
  onCheckOut: (customerId: string) => void;
  onDelete: (customerId: string) => void;
}

export default function CustomerCard({ customer, onCheckOut, onDelete }: CustomerCardProps) {
  const [, setTick] = useState(0);

  // Update time every second to trigger re-render (chỉ khi chưa checkout)
  useEffect(() => {
    if (customer.checkedOut) {
      // Nếu đã checkout, không cần update thời gian nữa
      return;
    }
    const interval = setInterval(() => {
      // Force re-render by updating state
      setTick(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [customer.checkedOut]);

  // Calculate values based on current time or checkout time
  const packageInfo = PACKAGES.find(p => p.type === customer.packageType)!;
  // Nếu đã checkout, sử dụng checkoutTime, nếu không thì dùng thời gian hiện tại
  const elapsedHours = calculateElapsedHours(customer.startTime, customer.checkoutTime);
  const overtimeHours = calculateOvertimeHours(customer, packageInfo.hours);
  const overtimeFee = calculateOvertimeFee(customer, packageInfo.hours);
  const overtimeFeePerHour = calculateOvertimeFeePerHour(customer, packageInfo.hours);

  const isOvertime = elapsedHours > packageInfo.hours;
  const timeRemaining = Math.max(0, packageInfo.hours - elapsedHours);

  return (
    <div className={`customer-card ${customer.checkedOut ? 'checked-out' : ''} ${isOvertime ? 'overtime' : ''}`}>
      <div className="card-header">
        <div className="card-number">
          <CreditCard size={18} />
          <span>Thẻ #{customer.cardNumber}</span>
        </div>
        {!customer.checkedOut && (
          <button 
            className="delete-btn"
            onClick={() => onDelete(customer.id)}
            title="Xóa"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="package-badge">
        {packageInfo.name}
      </div>

      <div className="time-info">
        <div className="time-row">
          <span className="time-label">Bắt đầu:</span>
          <span className="time-value">{formatTime(customer.startTime)}</span>
        </div>
        <div className="time-row">
          <span className="time-label">Ngày:</span>
          <span className="time-value">{formatDate(customer.startTime)}</span>
        </div>
        <div className="time-row">
          <span className="time-label">Đã sử dụng:</span>
          <span className={`time-value ${isOvertime ? 'overtime-text' : ''}`}>
            {formatDuration(elapsedHours)}
          </span>
        </div>
        {!customer.checkedOut && !isOvertime && (
          <div className="time-row">
            <span className="time-label">Còn lại:</span>
            <span className="time-value remaining">{formatRemainingTime(timeRemaining)}</span>
          </div>
        )}
        {customer.checkedOut && customer.checkoutTime && (
          <div className="time-row">
            <span className="time-label">Checkout lúc:</span>
            <span className="time-value">{formatTime(customer.checkoutTime)}</span>
          </div>
        )}
      </div>

      {isOvertime && (
        <div className="overtime-alert">
          <Clock size={18} />
          <div className="overtime-content">
            <div className="overtime-title">Đã quá giờ!</div>
            <div className="overtime-details">
              Quá {formatDuration(overtimeHours)} • Tổng phí: {formatCurrency(overtimeFee)}
            </div>
            {overtimeFeePerHour.length > 0 && (
              <div className="overtime-breakdown">
                <div className="breakdown-title">Chi tiết phí quá giờ:</div>
                <div className="breakdown-list">
                  {overtimeFeePerHour.map((item, index) => (
                    <div key={index} className="breakdown-item">
                      Giờ thứ {item.hour}: {formatCurrency(item.fee)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!customer.checkedOut && (
        <button 
          className="checkout-btn"
          onClick={() => onCheckOut(customer.id)}
        >
          <LogOut size={18} />
          Checkout {overtimeFee > 0 && `(${formatCurrency(overtimeFee)})`}
        </button>
      )}

      {customer.checkedOut && (
        <div className="checked-out-badge">
          Đã checkout
        </div>
      )}
    </div>
  );
}

