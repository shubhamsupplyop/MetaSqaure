import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TaskFrom from './components/TaskFrom';

function App() {
  return (
    <div className="App">
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<TaskFrom />} />
        </Routes>
      </BrowserRouter>
    </div>
   
  );
}



export default App;
