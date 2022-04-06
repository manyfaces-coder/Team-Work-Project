import {BrowserRouter} from "react-router-dom";
import {Route, Routes} from "react-router";
import Room from './pages/Room';
import Main from './pages/Main';
import NotFound404 from './pages/NotFound404';



function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Main />}></Route>
          <Route exact path="/room/:id" element={<Room />}></Route>
          <Route path='*' element={<NotFound404 />}></Route>
        </Routes>
      </BrowserRouter>
  ); 
}

export default App;