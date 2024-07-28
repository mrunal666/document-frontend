import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import SubDoc from "./SubDoc";
import TableDocs from "./TableDocs";
import EditorNew from "./EditorNew";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/create" />} />
          <Route exact path="/create" element={<EditorNew />} />
          <Route path="/tableDocs" element={<TableDocs />} />
          <Route path="/subDoc/:id" element={<SubDoc />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
