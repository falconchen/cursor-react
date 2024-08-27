import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import NoteList from './components/NoteList';
import AddButton from './components/AddButton';
import NoteDetail from './components/NoteDetail';

function App() {
  return (
    <Router>
      <div className="container">
        <Switch>
          <Route exact path="/">
            <Header />
            <NoteList />
            <AddButton />
          </Route>
          <Route path="/detail">
            <NoteDetail />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;