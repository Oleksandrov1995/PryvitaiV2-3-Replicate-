import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import { GenerateText} from './pages/GenerateText/GenerateText';
import UserPage from './pages/UserPage/UserPage';
import { StylizePhotoForPostcard } from './pages/StylizePhotoForPostcard/StylizePhotoForPostcard';
import { GalleryPage } from './pages/Gallery/GalleryPage';
import { MainPage } from './pages/MainPage/MainPage';
import { GenerateFluffyGreeting } from './pages/GenerateFluffyGreeting/GenerateFluffyGreeting';
import SignUpPage from './pages/Registration/SignUpPage/SignUpPage';
import SignInPage from './pages/Registration/SignIn/SignInPage';
import ResetPasswordPage from './pages/Registration/ResetPasswordPage/ResetPasswordPage';
import EditorPage from './pages/EditorPage/EditorPage';
// import EditorWrapper from './components/Editor/EditorWrapper';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
    <Route path="/" element={<MainPage />} />
    <Route path="/signUp" element={<SignUpPage/>} />
    <Route path="/SignIn" element={<SignInPage/>} />
    <Route path="/UserPage" element={<UserPage/>} />
    <Route path="/GenerateText" element={<GenerateText/>} />
    <Route path="/GenerateFluffyGreeting" element={<GenerateFluffyGreeting/>} />
    <Route path="/StylizePhotoForPostcard" element={<StylizePhotoForPostcard/>} />
    <Route path="/editor" element={<EditorPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage/>} />
    <Route path="/gallery" element={<GalleryPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
