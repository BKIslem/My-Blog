
import Register from './components/register';
import Login from './components/Login';
import Home from './components/Home';
import {Routes, Route} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>

      </Routes>
      {/* <Register/> */}
      </div>
  );
}

export default App;
