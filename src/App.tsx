import { useState, useEffect } from 'react';
import { Customer, PackageType, PACKAGES } from './types';
import { formatTime, formatDate, calculateElapsedHours, calculateOvertimeHours, calculateOvertimeFee, formatCurrency, formatDuration } from './utils';
import CheckInForm from './components/CheckInForm';
import CustomerCard from './components/CustomerCard';
import BillModal from './components/BillModal';
import { Clock, Users, Coffee } from 'lucide-react';
import './App.css';

function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [billCustomer, setBillCustomer] = useState<Customer | null>(null);

  // Load customers from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('customers');
    if (saved) {
      const parsed = JSON.parse(saved).map((c: any) => ({
        ...c,
        startTime: new Date(c.startTime),
        endTime: new Date(c.endTime),
        checkoutTime: c.checkoutTime ? new Date(c.checkoutTime) : undefined
      }));
      setCustomers(parsed);
    }
  }, []);

  // Save customers to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  // Note: CustomerCard components handle their own time updates
  // No need for global update trigger here

  const handleCheckIn = (cardNumber: string, packageType: PackageType) => {
    const now = new Date();
    const packageInfo = PACKAGES.find(p => p.type === packageType)!;
    const endTime = new Date(now.getTime() + packageInfo.hours * 60 * 60 * 1000);

    const newCustomer: Customer = {
      id: Date.now().toString(),
      cardNumber,
      packageType,
      startTime: now,
      endTime,
      checkedOut: false
    };

    setCustomers(prev => [...prev, newCustomer]);
    setShowCheckIn(false);
  };

  const handleCheckOut = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      const checkoutTime = new Date();
      // Mark as checked out with checkout time
      const updatedCustomer = {
        ...customer,
        checkedOut: true,
        checkoutTime: checkoutTime
      };
      setCustomers(prev => prev.map(c => 
        c.id === customerId ? updatedCustomer : c
      ));
      // Show bill with updated customer
      setBillCustomer(updatedCustomer);
    }
  };

  const handleCloseBill = () => {
    setBillCustomer(null);
  };

  const handleDelete = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  };

  const activeCustomers = customers.filter(c => !c.checkedOut);
  const totalOvertimeFee = activeCustomers.reduce((sum, c) => {
    const packageInfo = PACKAGES.find(p => p.type === c.packageType)!;
    return sum + calculateOvertimeFee(c, packageInfo.hours);
  }, 0);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Coffee size={32} />
            <h1>Thiba Space</h1>
          </div>
          <button 
            className="check-in-btn"
            onClick={() => setShowCheckIn(true)}
          >
            <Users size={20} />
            Check-in Khách Hàng
          </button>
        </div>
      </header>

      <div className="stats-bar">
        <div className="stat-card">
          <Clock size={24} />
          <div>
            <div className="stat-value">{activeCustomers.length}</div>
            <div className="stat-label">Đang sử dụng</div>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-value">{formatCurrency(totalOvertimeFee)}</div>
            <div className="stat-label">Tổng phí quá giờ</div>
          </div>
        </div>
      </div>

      {showCheckIn && (
        <CheckInForm
          onCheckIn={handleCheckIn}
          onClose={() => setShowCheckIn(false)}
        />
      )}

      {billCustomer && (
        <BillModal
          customer={billCustomer}
          onClose={handleCloseBill}
        />
      )}

      <div className="customers-section">
        <h2>Danh sách khách hàng đang sử dụng</h2>
        {activeCustomers.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <p>Chưa có khách hàng nào đang sử dụng</p>
            <button 
              className="primary-btn"
              onClick={() => setShowCheckIn(true)}
            >
              Check-in khách hàng đầu tiên
            </button>
          </div>
        ) : (
          <div className="customers-grid">
            {activeCustomers.map(customer => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onCheckOut={handleCheckOut}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {customers.filter(c => c.checkedOut).length > 0 && (
        <div className="customers-section">
          <h2>Lịch sử đã checkout</h2>
          <div className="customers-grid">
            {customers
              .filter(c => c.checkedOut)
              .map(customer => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  onCheckOut={handleCheckOut}
                  onDelete={handleDelete}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

