import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchItems = async () => {
    const res = await axios.get('/api/items');
    setItems(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`/api/items/${editId}`, { name, description });
    } else {
      await axios.post('/api/items', { name, description });
    }
    setName('');
    setDescription('');
    setEditId(null);
    fetchItems();
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setName(item.name);
    setDescription(item.description);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/items/${id}`);
    fetchItems();
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Item CRUD (H2 DB)</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="이름"
          required
          style={{ marginRight: 8 }}
        />
        <input
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="설명"
          required
          style={{ marginRight: 8 }}
        />
        <button type="submit">{editId ? '수정' : '추가'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setName(''); setDescription(''); }}>취소</button>}
      </form>
      <table border="1" cellPadding="8" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>설명</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>
                <button onClick={() => handleEdit(item)}>수정</button>
                <button onClick={() => handleDelete(item.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App; 