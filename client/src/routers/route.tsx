import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SignUpPage from '../pages/SignUpPage/SignUpPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import { AdminPage } from '../pages/AdminPage/AdminPage';
import { TilePage } from '../pages/TilesPage/TilesPage';
import type { User } from '../types/user.types';
import { getCurrentUser } from '../api/auth';

const TilesRoute = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return user ? <Navigate to="/tiles" replace /> : <Navigate to="/login" replace />;
};

export const TileRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/tiles" element={<TilePage />} />
        <Route path="*" element={<TilesRoute />} />
      </Routes>
    </BrowserRouter>
  );
};
