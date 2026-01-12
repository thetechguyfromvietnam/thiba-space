import { useRef } from 'react';
import { Customer, PACKAGES } from '../types';
import { formatTime, formatDate, formatCurrency, formatDuration } from '../utils';
import { X, Printer, CheckCircle, AlertCircle } from 'lucide-react';
import './BillModal.css';

interface BillModalProps {
  customer: Customer;
  onClose: () => void;
}

export default function BillModal({ customer, onClose }: BillModalProps) {
  const billRef = useRef<HTMLDivElement>(null);
  const packageInfo = PACKAGES.find(p => p.type === customer.packageType)!;
  // Use checkoutTime if available, otherwise use current time
  const checkoutTime = customer.checkoutTime || new Date();
  
  // Calculate elapsed hours based on checkout time
  const elapsedHours = (checkoutTime.getTime() - customer.startTime.getTime()) / (1000 * 60 * 60);
  const overtimeHours = Math.max(0, elapsedHours - packageInfo.hours);
  const totalOvertimeHours = overtimeHours > 0 ? Math.ceil(overtimeHours) : 0;
  const overtimeFee = totalOvertimeHours * 15000; // OVERTIME_RATE
  
  // Calculate overtime fee per hour
  const overtimeFeePerHour: { hour: number; fee: number }[] = [];
  if (totalOvertimeHours > 0) {
    for (let i = 1; i <= totalOvertimeHours; i++) {
      overtimeFeePerHour.push({
        hour: i,
        fee: 15000
      });
    }
  }
  
  const hasDebt = overtimeFee > 0;

  const handlePrint = () => {
    if (billRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Hóa đơn - Thẻ #${customer.cardNumber}</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  padding: 40px;
                  max-width: 600px;
                  margin: 0 auto;
                }
                .header {
                  text-align: center;
                  margin-bottom: 30px;
                  border-bottom: 2px solid #333;
                  padding-bottom: 20px;
                }
                .header h1 {
                  margin: 0;
                  color: #333;
                }
                .bill-info {
                  margin-bottom: 20px;
                }
                .bill-row {
                  display: flex;
                  justify-content: space-between;
                  padding: 8px 0;
                  border-bottom: 1px solid #eee;
                }
                .bill-label {
                  font-weight: 600;
                  color: #666;
                }
                .bill-value {
                  color: #333;
                }
                .section-title {
                  font-size: 18px;
                  font-weight: 700;
                  margin: 20px 0 10px 0;
                  color: #667eea;
                }
                .overtime-section {
                  background: #fff5f5;
                  padding: 15px;
                  border-radius: 8px;
                  border: 2px solid #ff6b6b;
                  margin: 20px 0;
                }
                .total-section {
                  background: #f8f9fa;
                  padding: 20px;
                  border-radius: 8px;
                  margin-top: 20px;
                  text-align: center;
                }
                .total-amount {
                  font-size: 24px;
                  font-weight: 700;
                  color: #ff6b6b;
                  margin-top: 10px;
                }
                .no-debt {
                  color: #51cf66;
                  font-weight: 700;
                  font-size: 18px;
                }
                .footer {
                  text-align: center;
                  margin-top: 40px;
                  padding-top: 20px;
                  border-top: 1px solid #eee;
                  color: #666;
                  font-size: 12px;
                }
              </style>
            </head>
            <body>
              ${billRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
    }
  };

  return (
    <div className="bill-modal-overlay" onClick={onClose}>
      <div className="bill-modal-content" onClick={(e) => e.stopPropagation()} ref={billRef}>
        <div className="bill-header">
          <div className="bill-logo">
            <h1>Thiba Space</h1>
            <p>Cà phê làm việc</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="bill-body">
          <div className="bill-title">
            <h2>HÓA ĐƠN THANH TOÁN</h2>
            <div className="bill-number">
              Mã: #{customer.id.slice(-6)}
            </div>
          </div>

          <div className="bill-info-section">
            <div className="info-row">
              <span className="info-label">Số thẻ:</span>
              <span className="info-value">#{customer.cardNumber}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Gói dịch vụ:</span>
              <span className="info-value">{packageInfo.name} ({packageInfo.description})</span>
            </div>
            <div className="info-row">
              <span className="info-label">Thời gian bắt đầu:</span>
              <span className="info-value">{formatTime(customer.startTime)} - {formatDate(customer.startTime)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Thời gian kết thúc:</span>
              <span className="info-value">{formatTime(checkoutTime)} - {formatDate(checkoutTime)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Tổng thời gian sử dụng:</span>
              <span className="info-value">{formatDuration(elapsedHours)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Thời gian gói:</span>
              <span className="info-value">{packageInfo.hours} giờ</span>
            </div>
          </div>

          {hasDebt && (
            <div className="overtime-section">
              <div className="overtime-header">
                <AlertCircle size={20} />
                <span className="overtime-title">Phí quá giờ</span>
              </div>
              <div className="overtime-details">
                <div className="overtime-summary">
                  Quá {formatDuration(overtimeHours)} • {totalOvertimeHours} giờ
                </div>
                {overtimeFeePerHour.length > 0 && (
                  <div className="overtime-breakdown">
                    {overtimeFeePerHour.map((item, index) => (
                      <div key={index} className="breakdown-row">
                        <span>Giờ thứ {item.hour}:</span>
                        <span>{formatCurrency(item.fee)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="total-section">
            {hasDebt ? (
              <>
                <div className="total-label">Tổng tiền cần thanh toán:</div>
                <div className="total-amount">{formatCurrency(overtimeFee)}</div>
                <div className="debt-note">
                  <AlertCircle size={16} />
                  Khách hàng có nợ tiền
                </div>
              </>
            ) : (
              <>
                <div className="total-label">Tổng tiền:</div>
                <div className="no-debt-amount">
                  <CheckCircle size={20} />
                  0 VNĐ
                </div>
                <div className="no-debt-note">
                  Khách hàng không có nợ tiền
                </div>
              </>
            )}
          </div>

          <div className="bill-footer">
            <p>Cảm ơn quý khách đã sử dụng dịch vụ!</p>
            <p className="footer-date">Ngày in: {formatDate(checkoutTime)} {formatTime(checkoutTime)}</p>
          </div>
        </div>

        <div className="bill-actions">
          <button className="print-btn" onClick={handlePrint}>
            <Printer size={18} />
            In hóa đơn
          </button>
          <button className="close-modal-btn" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

