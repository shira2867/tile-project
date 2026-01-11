import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUpPage from '../pages/SignUpPage/SignUpPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import { AdminPage } from '../pages/AdminPage/AdminPage';
import { TilePage } from '../pages/TilesPage/TilesPage';

export const TileRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/tiles" element={<TilePage />} />
      </Routes>
    </BrowserRouter>
  );
};