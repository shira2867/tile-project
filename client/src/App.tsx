import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUpPage from './pages/SingUpPage'
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App
