import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './tailwind.css';

//pages
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
