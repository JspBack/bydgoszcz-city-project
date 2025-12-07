import HomePage from './pages/HomePage.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element = {<RegisterPage/>}/>
        
      </Routes>
    </BrowserRouter>
  )
}
export default App;
