import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function Dashboard() {
  const { user } = useAuth();
  const [protectedData, setProtectedData] = useState('');
  const [publicData, setPublicData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPublicData();
  }, []);

  const fetchPublicData = async () => {
    try {
      const response = await axios.get('/api/v1/test/public');
      setPublicData(response.data);
    } catch (error) {
      console.error('공개 데이터 가져오기 실패:', error);
    }
  };

  const fetchProtectedData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get('/api/v1/test/protected');
      setProtectedData(response.data);
    } catch (error) {
      setError('보호된 데이터에 접근할 수 없습니다. 토큰이 유효하지 않을 수 있습니다.');
      console.error('보호된 데이터 가져오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>대시보드</h1>
        <p>안녕하세요, <strong>{user?.username}</strong>님!</p>
        <p>이메일: {user?.email}</p>
        <p>역할: {user?.role}</p>
      </div>

      <div className="card">
        <h2>API 테스트</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>공개 엔드포인트</h3>
          <p><strong>응답:</strong> {publicData}</p>
          <button 
            className="btn btn-secondary" 
            onClick={fetchPublicData}
          >
            새로고침
          </button>
        </div>

        <div>
          <h3>보호된 엔드포인트</h3>
          {error && <div className="alert alert-error">{error}</div>}
          {protectedData && <div className="alert alert-success">{protectedData}</div>}
          <button 
            className="btn btn-primary" 
            onClick={fetchProtectedData}
            disabled={loading}
          >
            {loading ? '로딩 중...' : '보호된 데이터 가져오기'}
          </button>
        </div>
      </div>

      <div className="card">
        <h2>JWT 토큰 정보</h2>
        <p>현재 JWT 토큰이 브라우저의 로컬 스토리지에 저장되어 있습니다.</p>
        <p>이 토큰은 API 요청 시 자동으로 Authorization 헤더에 포함됩니다.</p>
        <p>토큰 만료 시간: 24시간</p>
      </div>
    </div>
  );
}

export default Dashboard; 