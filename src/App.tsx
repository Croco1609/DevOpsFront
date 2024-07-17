import { Routes, Route } from 'react-router-dom';
import Home from './Screens/Home/Home';
import About from './Screens/About/About';
import Category from './Screens/Category/Category';
import ExchangeSpace from './Screens/ExchangeSpace/ExchangeSpace';
import Faq from './Screens/FAQ/Faq';
import Resources from './Screens/Resources/Resources';
import Login from './Screens/Login/Login';
import Signup from './Screens/Signup/SignupScreen';
import Profile from './Screens/Profile/Profile';
import BackOfficeHome from './Screens/BackOfficeHome/BackOfficeHome';
import NotFound from './Components/NotFound/NotFound';
import WaitingRessources from './Screens/WaitingRessources/WaitingRessources';
import ResourcesDetails from './Screens/ResourcesDetails/ResourcesDetails';
import SavedRessources from './Screens/SavedRessources/SavedRessources';
import Reports from './Screens/Reports/Reports'
import BackOfficeCategories from './Screens/BackOfficeCategories/BackOfficeCategories';
import BackOfficeStats from './Screens/BackOfficeStats/BackOfficeStats';
import UpdateProfile from './Screens/UpdateProfile/UpdateProfile';
import UserList from './Screens/UsersList/UsersList';
import BackOfficeReports from './Screens/BackOfficeReports/BackOfficeReports';
import ResetPassword from './Screens/ResetPassword/ResetPassword';
import UpdatePassword from './Screens/UpdatePassword/UpdatePassword';

//La route * doit etre en dernier, pour la page 404
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category" element={<Category />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/:id" element={<ResourcesDetails />} />
        <Route path="/exchangeSpace" element={<ExchangeSpace />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/my-profile" element={<Profile />} />
        <Route path="/backoffice" element={<BackOfficeHome />} />
        <Route path='/backoffice/waitingRessources' element={<WaitingRessources/>}/>
        <Route path='/backoffice/reports' element={<BackOfficeReports/>}/>
        <Route path='/backoffice/categories' element={<BackOfficeCategories/>}/>
        <Route path='/backoffice/stats' element={<BackOfficeStats/>}/>
        <Route path='/backoffice/usersList' element={<UserList/>}/>
        <Route path='/my-saved-resources' element={<SavedRessources/>}/>
        <Route path='/update-profile' element={<UpdateProfile/>}/>
        <Route path='/password-reset' element={<ResetPassword/>}/>
        <Route path='/update-password' element={<UpdatePassword/>}/>
        
        <Route path="*" element={<NotFound />} />
      </Routes>

    </div>
  );
}

export default App;
