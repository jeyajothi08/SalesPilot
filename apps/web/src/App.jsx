import React from 'react';
import AppRouter from './AppRouter';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen bg-black overflow-hidden font-sans">
        <AppRouter />
      </div>
    </ErrorBoundary>
  );
}

export default App;
