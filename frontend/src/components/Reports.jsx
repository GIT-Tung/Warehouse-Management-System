import React, { useState, useEffect } from 'react';
import { useAuth, API_BASE_URL } from '../App';

export default function Reports() {
  const { token } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReportsData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      // Fetch stats
      const statsRes = await fetch(`${API_BASE_URL}/api/reports/inventory`, { headers });
      let statsData = null;
      if (statsRes.ok) {
        statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch low stock items
      const lowStockRes = await fetch(`${API_BASE_URL}/api/products/low-stock?threshold=10`, { headers });
      if (lowStockRes.ok) {
        setLowStockProducts(await lowStockRes.json());
      }

      // Fetch recent imports and exports to construct unified feed
      const [impRes, expRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/imports`, { headers }),
        fetch(`${API_BASE_URL}/api/exports`, { headers })
      ]);

      const activities = [];
      if (impRes.ok) {
        const imports = await impRes.json();
        imports.forEach(imp => {
          activities.push({
            id: `PN-${String(imp.receiptID).padStart(4, '0')}`,
            type: 'import',
            date: new Date(imp.importDate),
            user: imp.user?.fullName || 'Hệ thống',
            note: imp.note || 'Nhập hàng hóa'
          });
        });
      }

      if (expRes.ok) {
        const exports = await expRes.json();
        exports.forEach(exp => {
          activities.push({
            id: `PX-${String(exp.receiptID).padStart(4, '0')}`,
            type: 'export',
            date: new Date(exp.exportDate),
            user: exp.user?.fullName || 'Hệ thống',
            note: exp.note || 'Xuất hàng hóa'
          });
        });
      }

      // Sort activities by date descending
      activities.sort((a, b) => b.date - a.date);
      setRecentActivities(activities.slice(0, 5)); // Keep last 5 activities

    } catch (err) {
      console.error('Error loading report statistics:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchReportsData();
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
        Đang tổng hợp dữ liệu báo cáo...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Báo Cáo & Thống Kê</h1>
        <button className="btn-secondary" onClick={fetchReportsData}>
          🔄 Làm mới dữ liệu
        </button>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card glass-panel" style={{ borderLeft: '4px solid var(--color-primary)' }}>
          <div className="stat-title">Số loại sản phẩm</div>
          <div className="stat-value">{stats?.totalProductTypes || 0}</div>
          <div className="stat-trend" style={{ color: 'var(--text-muted)' }}>Danh mục phân loại</div>
        </div>

        <div className="stat-card glass-panel" style={{ borderLeft: '4px solid var(--color-warning)' }}>
          <div className="stat-title">Tổng số hàng hóa</div>
          <div className="stat-value">{stats?.totalQuantity || 0}</div>
          <div className="stat-trend" style={{ color: 'var(--text-muted)' }}>Chiếc / sản phẩm tồn kho</div>
        </div>

        <div className="stat-card glass-panel" style={{ borderLeft: '4px solid var(--color-success)' }}>
          <div className="stat-title">Ước tính giá trị nhập</div>
          <div className="stat-value" style={{ fontSize: '24px' }}>
            {(stats?.totalImportValue || 0).toLocaleString()} đ
          </div>
          <div className="stat-trend" style={{ color: 'var(--color-success)' }}>Giá trị vốn tồn kho</div>
        </div>

        <div className="stat-card glass-panel" style={{ borderLeft: '4px solid #a5b4fc' }}>
          <div className="stat-title">Ước tính giá trị bán</div>
          <div className="stat-value" style={{ fontSize: '24px' }}>
            {(stats?.totalExportValue || 0).toLocaleString()} đ
          </div>
          <div className="stat-trend" style={{ color: '#a5b4fc' }}>Tiềm năng doanh thu</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Low Stock Panel */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚠️</span> Cảnh báo hết hàng (Tồn kho &lt; 10)
          </h3>

          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <table className="custom-table" style={{ fontSize: '13px' }}>
              <thead>
                <tr>
                  <th>Mã SP</th>
                  <th>Tên sản phẩm</th>
                  <th style={{ textAlign: 'right' }}>Tồn kho</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-success)', padding: '16px' }}>
                      🟢 Kho hàng ổn định, không có sản phẩm nào sắp hết!
                    </td>
                  </tr>
                ) : (
                  lowStockProducts.map(prod => (
                    <tr key={prod.productID}>
                      <td style={{ fontWeight: '600', color: 'var(--color-primary)' }}>{prod.productCode}</td>
                      <td>{prod.productName}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="badge badge-danger">{prod.quantity}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed Panel */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚡</span> Nhật ký giao dịch gần đây
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentActivities.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>
                Chưa có nhật ký hoạt động nào.
              </div>
            ) : (
              recentActivities.map(act => (
                <div 
                  key={act.id} 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-glass)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '20px' }}>{act.type === 'import' ? '📥' : '📤'}</span>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-main)' }}>
                        {act.id} - {act.type === 'import' ? 'Nhập Kho' : 'Xuất Kho'}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Bởi {act.user} • {act.note}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {act.date.toLocaleDateString('vi-VN')} {act.date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
