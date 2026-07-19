import React from 'react';
import { useAuth } from '../App';
import Products from './Products';
import Transactions from './Transactions';
import Reports from './Reports';

export default function Dashboard({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <Products />;
      case 'imports':
        return <Transactions type="import" />;
      case 'exports':
        return <Transactions type="export" />;
      case 'reports':
        return <Reports />;
      default:
        return <Products />;
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span style={{ fontSize: '24px' }}>📦</span>
          <span>WareHouse</span>
        </div>

        <nav className="sidebar-menu">
          <div
            className={`menu-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <span>🛍️</span>
            <span>Sản Phẩm</span>
          </div>

          <div
            className={`menu-item ${activeTab === 'imports' ? 'active' : ''}`}
            onClick={() => setActiveTab('imports')}
          >
            <span>📥</span>
            <span>Nhập Kho</span>
          </div>

          <div
            className={`menu-item ${activeTab === 'exports' ? 'active' : ''}`}
            onClick={() => setActiveTab('exports')}
          >
            <span>📤</span>
            <span>Xuất Kho</span>
          </div>

          <div
            className={`menu-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <span>📊</span>
            <span>Báo Cáo</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-name">{user?.fullName || 'Hệ thống'}</span>
            <span className="user-role">{user?.role === 'ADMIN' ? 'Quản Trị Viên' : user?.role === 'MANAGER' ? 'Quản Lý' : 'Nhân Viên'}</span>
          </div>
          <button onClick={logout} className="btn-secondary logout-btn">
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}
