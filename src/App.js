import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';
import ROUTES from './Routes';

import GeneratePage from './pages/GeneratePage';
import VisualizePage from './pages/VisualizePage';

function App() {
  const renderApp = () => (
    <Routes>
      <Route
        key={ROUTES.LANDING}
        exact path={ROUTES.LANDING}
        element={<GeneratePage/>}
      />
      <Route
        key={ROUTES.VISUALIZE}
        exact path={ROUTES.VISUALIZE}
        element={<VisualizePage/>}
      />
    </Routes>
  );

  //const test = renderApp();

  return (
    <div>
      <Router>
        {renderApp()}
      </Router>
    </div>
  );
}

export default App;
