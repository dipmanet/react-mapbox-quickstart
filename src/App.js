import React, {BrowserRouter, Routes, Route} from 'react-router-dom'
import Map from './components/map'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route  path={'/'} element={<Map />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
