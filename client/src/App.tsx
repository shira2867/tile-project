import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUpPage from '../src/pages/SignUpPage/SignUpPage'
import LoginPage from '../src/pages/LoginPage/LoginPage';
import { AdminPage } from './pages/AdminPage/AdminPage';
import { FooterProvider } from './context/FooterContext';
import { UserProvider } from './context/UserContext';
import { TilePage } from './pages/TilesPage/TilesPage';

function App() {
  return (
    <UserProvider>
      <FooterProvider>
       <BrowserRouter>
          <Routes>
           <Route path="/signup" element={<SignUpPage />} />
           <Route path="/login" element={<LoginPage />} />
           <Route path="/admin" element={<AdminPage />} />
           <Route path="/tiles" element={<TilePage />} />
          </Routes>
       </BrowserRouter>
     </FooterProvider>
   </UserProvider>
  );
}

export default App
