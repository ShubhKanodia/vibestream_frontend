import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './pages/Login';
import AuthSuccess from './pages/AuthSuccess';
import AuthRedirector from './pages/AuthRedirector';

import './App.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
              <Route path="/" element={<AuthRedirector />}/>
              <Route path="/login" element={<Login />} />
              <Route path="/auth-success" element={<AuthSuccess />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
