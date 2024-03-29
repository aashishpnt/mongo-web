import './App.css';
import './index.css'
import HeroSection from './components/Home Page/HeroSection';
import FeatureSection from './components/Home Page/FeatureSection';
import QuerySection from './components/Home Page/QuerySection';
import NotFound from './components/NotFound/Notfound'
import Login from './components/Login/Login'
import SignUp from './components/SignUp/SignUp'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import Dashboard from './components/Dashboard/dashboard.js'
import { RequireToken } from './components/Auth.js'

import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route element={
        <>
        <HeroSection />
        <FeatureSection />
        <QuerySection />
        </>}
        path="/" />
        <Route element={
          <RequireToken>
            <Dashboard />
          </RequireToken>
          } path="/dashboard" />
        <Route element={<Login />} path="/login" />
        <Route element={<SignUp />} path="/signup" />
        <Route element={<NotFound />} path="*" />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
