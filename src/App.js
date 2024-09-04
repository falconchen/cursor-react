import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import NoteList from './components/NoteList';
import AddButton from './components/AddButton';
import NoteDetail from './components/NoteDetail';
import NoteView from './components/NoteView';

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <NoteList />
            </>
          } />
          <Route path="/detail/:mode" element={<NoteDetail />} />
          <Route path="/detail/edit/:id" element={<NoteDetail />} />
          <Route path="/note/:id" element={<NoteView />} />
        </Routes>
        <AddButton />
      </div>
    </Router>
  );
}

export default App;
