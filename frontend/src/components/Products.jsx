import React, { useState, useEffect } from 'react';
import { useAuth, API_BASE_URL } from '../App';

export default function Products() {
  const { token, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dialog state
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  
  // Form fields state
  const [productCode, setProductCode] = useState('');
  const [productName, setProductName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [unit, setUnit] = useState('Piece');
  const [importPrice, setImportPrice] = useState('');
  const [exportPrice, setExportPrice] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(true);
  
  const [formError, setFormError] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchCategoriesAndSuppliers = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [catRes, supRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/categories`, { headers }),
        fetch(`${API_BASE_URL}/api/suppliers`, { headers }),
      ]);
      
      if (catRes.ok) setCategories(await catRes.json());
      if (supRes.ok) setSuppliers(await supRes.json());
    } catch (err) {
      console.error('Error fetching categories/suppliers:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchCategoriesAndSuppliers()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (!query.trim()) {
      fetchProducts();
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/products/search?keyword=${encodeURIComponent(query)}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error searching products:', err);
    }
  };

  const openAddModal = () => {
    setEditProduct(null);
    setProductCode('');
    setProductName('');
    setCategoryId(categories[0]?.categoryID || '');
    setSupplierId(suppliers[0]?.supplierID || '');
    setUnit('Piece');
    setImportPrice('');
    setExportPrice('');
    setDescription('');
    setStatus(true);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (prod) => {
    setEditProduct(prod);
    setProductCode(prod.productCode);
    setProductName(prod.productName);
    setCategoryId(prod.category?.categoryID || '');
    setSupplierId(prod.supplier?.supplierID || '');
    setUnit(prod.unit);
    setImportPrice(prod.importPrice);
    setExportPrice(prod.exportPrice);
    setDescription(prod.description || '');
    setStatus(prod.status !== false);
    setFormError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!productCode || !productName || !importPrice || !exportPrice) {
      setFormError('Vui lòng nhập các trường có dấu sao (*).');
      return;
    }

    const payload = {
      productCode,
      productName,
      category: { categoryID: parseInt(categoryId) },
      supplier: { supplierID: parseInt(supplierId) },
      unit,
      importPrice: parseFloat(importPrice),
      exportPrice: parseFloat(exportPrice),
      description,
      status,
      quantity: editProduct ? editProduct.quantity : 0, // Mặc định khi tạo mới số lượng là 0
    };

    try {
      const url = editProduct 
        ? `${API_BASE_URL}/api/products/${editProduct.productID}`
        : `${API_BASE_URL}/api/products`;
      
      const method = editProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        fetchProducts();
      } else {
        const errorData = await res.text();
        setFormError(errorData || 'Có lỗi xảy ra khi lưu sản phẩm.');
      }
    } catch (err) {
      setFormError('Lỗi kết nối đến server.');
    }
  };

  const handleDelete = async (id) => {
    if (user?.role !== 'ADMIN') {
      alert('Chỉ tài khoản QUẢN TRỊ VIÊN mới có quyền xóa sản phẩm.');
      return;
    }

    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        fetchProducts();
      } else {
        alert('Không thể xóa sản phẩm. Có thể sản phẩm đã có trong phiếu nhập/xuất.');
      }
    } catch (err) {
      alert('Lỗi kết nối server.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Quản Lý Sản Phẩm</h1>
        <button className="btn-primary" onClick={openAddModal}>
          <span>➕</span> Thêm Sản Phẩm
        </button>
      </div>

      <div className="filter-panel glass-panel" style={{ padding: '16px' }}>
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Tìm kiếm sản phẩm theo tên, mã..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Đang tải danh sách sản phẩm...
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Mã sản phẩm</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Nhà cung cấp</th>
                <th>Đơn vị</th>
                <th style={{ textAlign: 'right' }}>Số lượng</th>
                <th style={{ textAlign: 'right' }}>Giá nhập</th>
                <th style={{ textAlign: 'right' }}>Giá bán</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                    Không tìm thấy sản phẩm nào.
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod.productID}>
                    <td style={{ fontWeight: '600', color: 'var(--color-primary)' }}>{prod.productCode}</td>
                    <td>{prod.productName}</td>
                    <td>{prod.category?.categoryName || 'N/A'}</td>
                    <td>{prod.supplier?.supplierName || 'N/A'}</td>
                    <td>{prod.unit}</td>
                    <td style={{ textAlign: 'right', fontWeight: '600' }}>
                      {prod.quantity < 10 ? (
                        <span className="badge badge-danger" title="Sắp hết hàng">{prod.quantity}</span>
                      ) : (
                        <span className="badge badge-success">{prod.quantity}</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>{prod.importPrice?.toLocaleString()} đ</td>
                    <td style={{ textAlign: 'right' }}>{prod.exportPrice?.toLocaleString()} đ</td>
                    <td>
                      {prod.status ? (
                        <span className="badge badge-success">Đang kinh doanh</span>
                      ) : (
                        <span className="badge badge-danger">Ngừng kinh doanh</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => openEditModal(prod)}>
                          Sửa
                        </button>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '6px 12px', fontSize: '12px', borderColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--color-danger)' }}
                          onClick={() => handleDelete(prod.productID)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Dialog Form */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card glass-panel">
            <div className="modal-header">
              <h3 className="modal-title">{editProduct ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            {formError && <div className="error-message" style={{ marginBottom: '16px' }}>{formError}</div>}

            <form onSubmit={handleSave}>
              <div className="form-grid">
                <div>
                  <label className="form-label">Mã sản phẩm *</label>
                  <input
                    type="text"
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    placeholder="VD: LT001..."
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Tên sản phẩm *</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Nhập tên sản phẩm..."
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Danh mục *</label>
                  <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                    {categories.map((cat) => (
                      <option key={cat.categoryID} value={cat.categoryID}>{cat.categoryName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Nhà cung cấp *</label>
                  <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
                    {suppliers.map((sup) => (
                      <option key={sup.supplierID} value={sup.supplierID}>{sup.supplierName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Đơn vị tính</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="Cái, Chiếc, Hộp..."
                  />
                </div>

                <div>
                  <label className="form-label">Trạng thái kinh doanh</label>
                  <select value={status ? 'true' : 'false'} onChange={(e) => setStatus(e.target.value === 'true')}>
                    <option value="true">Đang bán</option>
                    <option value="false">Ngừng kinh doanh</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Giá nhập (VNĐ) *</label>
                  <input
                    type="number"
                    value={importPrice}
                    onChange={(e) => setImportPrice(e.target.value)}
                    placeholder="Giá mua vào..."
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Giá bán (VNĐ) *</label>
                  <input
                    type="number"
                    value={exportPrice}
                    onChange={(e) => setExportPrice(e.target.value)}
                    placeholder="Giá bán ra..."
                    required
                  />
                </div>

                <div className="form-grid-full">
                  <label className="form-label">Mô tả sản phẩm</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Thông số kỹ thuật, cấu hình..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  {editProduct ? 'Cập Nhật' : 'Lưu Lại'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
