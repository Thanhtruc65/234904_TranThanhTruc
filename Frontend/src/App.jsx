import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/books';

function App() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ bookId: '', title: '', author: '', category: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchBooks = async (query = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}?search=${query}`);
      setBooks(res.data);
    } catch (err) { setMessage('Lỗi khi tải dữ liệu'); }
    setLoading(false);
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(search);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form);
        setMessage('Cập nhật thành công!');
      } else {
        await axios.post(API_URL, form);
        setMessage('Thêm sách thành công!');
      }
      setForm({ bookId: '', title: '', author: '', category: '' });
      setEditId(null);
      fetchBooks();
    } catch (err) { setMessage(err.response?.data?.message || 'Lỗi lưu dữ liệu'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMessage('Xóa thành công!');
      fetchBooks();
    } catch (err) { setMessage('Lỗi khi xóa'); }
  };

  const handleEdit = (book) => {
    setForm(book);
    setEditId(book._id);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Quản Lý Sách (2212345 Nguyễn Văn An)</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}

      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input type="text" placeholder="Tìm kiếm sách..." value={search} onChange={e => setSearch(e.target.value)} />
        <button type="submit">Tìm</button>
      </form>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <input name="bookId" placeholder="Mã sách" value={form.bookId} onChange={handleChange} required disabled={editId} />
        <input name="title" placeholder="Tên sách" value={form.title} onChange={handleChange} required />
        <input name="author" placeholder="Tác giả" value={form.author} onChange={handleChange} required />
        <input name="category" placeholder="Thể loại" value={form.category} onChange={handleChange} />
        <button type="submit">{editId ? 'Cập nhật' : 'Thêm sách'}</button>
        {editId && <button onClick={() => { setEditId(null); setForm({}); }}>Hủy</button>}
      </form>

      {loading ? <p>Đang tải...</p> : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr><th>Mã sách</th><th>Tên sách</th><th>Tác giả</th><th>Thể loại</th><th>Hành động</th></tr>
          </thead>
          <tbody>
            {books.map(b => (
              <tr key={b._id}>
                <td>{b.bookId}</td><td>{b.title}</td><td>{b.author}</td><td>{b.category}</td>
                <td>
                  <button onClick={() => handleEdit(b)}>Sửa</button>
                  <button onClick={() => handleDelete(b._id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default App;