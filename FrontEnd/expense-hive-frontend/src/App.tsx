import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Dashboard from './components/pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' Component={Login} />
        <Route path='/register' Component={Register} />
        <Route path='/' Component={Login} />
        <Route path='/dashboard' Component={Dashboard} />
      </Routes>
    </Router>
  );
}

export default App;
