import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './pages/Login';
import AuthSuccess from './pages/AuthSuccess';

import './App.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
              <Route path="/" element={<AuthSuccess />}/>
              <Route path="/login" element={<Login />} />
              <Route path="/auth-success" element={<AuthSuccess />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
