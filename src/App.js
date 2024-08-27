import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import NoteList from './components/NoteList';
import AddButton from './components/AddButton';
import NoteDetail from './components/NoteDetail';

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <NoteList />
              <AddButton />
            </>
          } />
          <Route path="/detail" element={<NoteDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
