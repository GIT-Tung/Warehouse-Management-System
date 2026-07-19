import React, { useState, useEffect } from 'react';
import { useAuth, API_BASE_URL } from '../App';

export default function Transactions({ type }) {
  const isImport = type === 'import';
  const { token, user } = useAuth();
  
  const [receipts, setReceipts] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [supplierID, setSupplierID] = useState('');
  const [note, setNote] = useState('');
  const [items, setItems] = useState([]); // Array of { productID, quantity, price }
  const [formError, setFormError] = useState('');

  const fetchReceipts = async () => {
    try {
      const endpoint = isImport ? '/api/imports' : '/api/exports';
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setReceipts(data.reverse()); // Show newest first
      }
    } catch (err) {
      console.error('Error fetching receipts:', err);
    }
  };

  const fetchProductsAndSuppliers = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [prodRes, supRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/products`, { headers }),
        fetch(`${API_BASE_URL}/api/suppliers`, { headers }),
      ]);
      
      if (prodRes.ok) setProducts(await prodRes.json());
      if (isImport && supRes.ok) {
        const supData = await supRes.json();
        setSuppliers(supData);
        if (supData.length > 0) setSupplierID(supData[0].supplierID);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchReceipts(), fetchProductsAndSuppliers()]);
      setLoading(false);
    };
    init();
  }, [type]);

  const openCreateModal = () => {
    setNote('');
    setItems([{ productID: products[0]?.productID || '', quantity: 1, price: isImport ? (products[0]?.importPrice || 0) : (products[0]?.exportPrice || 0) }]);
    if (suppliers.length > 0) setSupplierID(suppliers[0].supplierID);
    setFormError('');
    setShowModal(true);
  };

  const handleAddItemRow = () => {
    const defaultProduct = products[0];
    setItems([
      ...items,
      {
        productID: defaultProduct?.productID || '',
        quantity: 1,
        price: isImport ? (defaultProduct?.importPrice || 0) : (defaultProduct?.exportPrice || 0)
      }
    ]);
  };

  const handleRemoveItemRow = (index) => {
    if (items.length === 1) return;
    const newItems = items.filter((_, idx) => idx !== index);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    if (field === 'productID') {
      const selectedProd = products.find(p => p.productID === parseInt(value));
      newItems[index].productID = parseInt(value);
      newItems[index].price = isImport ? (selectedProd?.importPrice || 0) : (selectedProd?.exportPrice || 0);
    } else if (field === 'quantity') {
      newItems[index].quantity = parseInt(value) || 0;
    } else if (field === 'price') {
      newItems[index].price = parseFloat(value) || 0;
    }
    setItems(newItems);
  };

  const calculateReceiptTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isImport && !supplierID) {
      setFormError('Vui lòng chọn nhà cung cấp.');
      return;
    }

    if (items.some(item => !item.productID || item.quantity <= 0 || item.price < 0)) {
      setFormError('Vui lòng kiểm tra lại danh sách sản phẩm. Số lượng phải lớn hơn 0 và giá phải lớn hơn hoặc bằng 0.');
      return;
    }

    const payload = {
      userID: user.userID,
      note,
      items: items.map(item => ({
        productID: item.productID,
        quantity: item.quantity,
        price: item.price
      }))
    };

    if (isImport) {
      payload.supplierID = parseInt(supplierID);
    }

    try {
      const endpoint = isImport ? '/api/imports' : '/api/exports';
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowModal(false);
        fetchReceipts();
      } else {
        const errorText = await res.text();
        if (errorText.includes('Not enough quantity')) {
          setFormError('LỖI: Không đủ số lượng hàng tồn kho cho giao dịch xuất này!');
        } else {
          setFormError(errorText || 'Giao dịch thất bại. Vui lòng thử lại.');
        }
      }
    } catch (err) {
      setFormError('Lỗi kết nối server.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{isImport ? 'Nhập Kho Hàng Hóa' : 'Xuất Kho Hàng Hóa'}</h1>
        <button className="btn-primary" onClick={openCreateModal}>
          <span>➕</span> {isImport ? 'Lập Phiếu Nhập' : 'Lập Phiếu Xuất'}
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Đang tải danh sách phiếu...
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Mã phiếu</th>
                <th>Ngày thực hiện</th>
                <th>Người thực hiện</th>
                {isImport && <th>Nhà cung cấp</th>}
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {receipts.length === 0 ? (
                <tr>
                  <td colSpan={isImport ? "5" : "4"} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                    Chưa có phiếu giao dịch nào được lập.
                  </td>
                </tr>
              ) : (
                receipts.map((rec) => (
                  <tr key={rec.receiptID}>
                    <td style={{ fontWeight: '600', color: 'var(--color-primary)' }}>
                      {isImport ? `PN-${String(rec.receiptID).padStart(4, '0')}` : `PX-${String(rec.receiptID).padStart(4, '0')}`}
                    </td>
                    <td>{new Date(isImport ? rec.importDate : rec.exportDate).toLocaleString('vi-VN')}</td>
                    <td>{rec.user?.fullName || 'Hệ thống'}</td>
                    {isImport && <td>{rec.supplier?.supplierName}</td>}
                    <td style={{ color: 'var(--text-muted)' }}>{rec.note || '---'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Dialog Form Lập Phiếu */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card glass-panel" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{isImport ? 'Lập Phiếu Nhập Kho' : 'Lập Phiếu Xuất Kho'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            {formError && <div className="error-message" style={{ marginBottom: '16px' }}>{formError}</div>}

            <form onSubmit={handleSave}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                {isImport && (
                  <div style={{ flex: 1 }}>
                    <label className="form-label">Nhà cung cấp *</label>
                    <select value={supplierID} onChange={(e) => setSupplierID(e.target.value)}>
                      {suppliers.map((sup) => (
                        <option key={sup.supplierID} value={sup.supplierID}>{sup.supplierName}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div style={{ flex: 2 }}>
                  <label className="form-label">Ghi chú</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Nhập ghi chú giao dịch..."
                  />
                </div>
              </div>

              <div className="receipt-items-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>Danh sách sản phẩm</span>
                  <button type="button" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={handleAddItemRow}>
                    + Thêm dòng
                  </button>
                </div>

                <div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
                  {items.map((item, idx) => (
                    <div key={idx} className="receipt-item-row">
                      <select value={item.productID} onChange={(e) => handleItemChange(idx, 'productID', e.target.value)}>
                        {products.map((prod) => (
                          <option key={prod.productID} value={prod.productID}>
                            {prod.productName} ({prod.productCode}) - Tồn: {prod.quantity}
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        placeholder="SL"
                        required
                      />

                      <input
                        type="number"
                        min="0"
                        value={item.price}
                        onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                        placeholder="Đơn giá"
                        required
                      />

                      <button
                        type="button"
                        className="remove-row-btn"
                        onClick={() => handleRemoveItemRow(idx)}
                        disabled={items.length === 1}
                        style={{ opacity: items.length === 1 ? 0.3 : 1 }}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px', marginBottom: '16px' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Tổng giá trị phiếu:</span>
                <span style={{ fontSize: '20px', fontWeight: '700', color: isImport ? 'var(--color-success)' : 'var(--color-primary)' }}>
                  {calculateReceiptTotal().toLocaleString()} VNĐ
                </span>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  Hoàn Tất Giao Dịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
