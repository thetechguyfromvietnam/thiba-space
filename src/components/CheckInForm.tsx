import { useState } from 'react';
import { PackageType, PACKAGES } from '../types';
import { X } from 'lucide-react';
import './CheckInForm.css';

interface CheckInFormProps {
  onCheckIn: (cardNumber: string, packageType: PackageType) => void;
  onClose: () => void;
}

export default function CheckInForm({ onCheckIn, onClose }: CheckInFormProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.trim() && selectedPackage) {
      onCheckIn(cardNumber.trim(), selectedPackage);
      setCardNumber('');
      setSelectedPackage(null);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Check-in Khách Hàng</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="check-in-form">
          <div className="form-group">
            <label htmlFor="cardNumber">Số thẻ</label>
            <input
              id="cardNumber"
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="Nhập số thẻ của khách hàng"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Chọn gói dịch vụ</label>
            <div className="package-options">
              {PACKAGES.map(pkg => (
                <div
                  key={pkg.type}
                  className={`package-card ${selectedPackage === pkg.type ? 'selected' : ''}`}
                  onClick={() => setSelectedPackage(pkg.type)}
                >
                  <div className="package-name">{pkg.name}</div>
                  <div className="package-description">{pkg.description}</div>
                  <div className="package-hours">
                    {pkg.hours < 1 
                      ? `${Math.round(pkg.hours * 60)} phút` 
                      : `${pkg.hours} giờ`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Hủy
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={!cardNumber.trim() || !selectedPackage}
            >
              Check-in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

