import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NhostProvider } from '@nhost/react';
import { nhost } from './lib/nhost';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ChatHome from './components/ChatHome';

const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);


const App: React.FC = () => {
  return (
    <NhostProvider nhost={nhost}>
      <Router>
        <Routes>
          <Route path="/chat" element={<ChatHome />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/chat" replace />} />
        </Routes>
      </Router>
    </NhostProvider>
  );
};

export default App;