import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Editor from './pages/Editor/Editor';
import { Main } from './pages/Main/Main';
import { GenereteText } from './pages/GenereteText/GenereteText';
import { GenereteImage } from './pages/GenereteImage/GenereteImage';
import SignUp from './pages/Registration/SignUp/SignUp';
import SignIn from './pages/Registration/SignIn/SignIn';
import ResetPassword from './pages/Registration/ResetPassword/ResetPassword';
import UserPage from './pages/UserPage/UserPage';
import { StylizePhotoForPostcard } from './pages/StylizePhotoForPostcard/StylizePhotoForPostcard';
// import EditorWrapper from './components/Editor/EditorWrapper';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
    <Route path="/" element={<Main />} />
    <Route path="/signUp" element={<SignUp/>} />
    <Route path="/SignIn" element={<SignIn/>} />
    <Route path="/UserPage" element={<UserPage/>} />
    <Route path="/GenereteText" element={<GenereteText/>} />
    <Route path="/GenereteImage" element={<GenereteImage/>} />
    <Route path="/StylizePhotoForPostcard" element={<StylizePhotoForPostcard/>} />
    <Route path="/editor" element={<Editor />} />
    <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
