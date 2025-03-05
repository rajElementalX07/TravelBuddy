import { useEffect } from 'react';
import './App.css';
import Aos from 'aos';
import { Toaster } from 'react-hot-toast';
import {  Route, Routes,  } from 'react-router-dom';
import Header from './components/Header';
import AuthPage from './pages/AuthPage';
import NotFound from './pages/NotFound';
import HomePage from './pages/HomePage';
import ProtectedRoute from './utils/ProtectedRoute';
import TripPosts from './pages/TripPosts';
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';
import Chat from './components/Chat';
import UpdateProfile from './components/UpdateProfile';
import TravellerSocialCard from './components/TravellerSocialCard'

function App() {
  useEffect(()=>{
        
    Aos.init();

},[]);

  return (
    <>
    <Toaster position="top-center"  reverseOrder={false} toastOptions={{duration: 5000}}/>
   <Header/>
    <Routes>
      <Route path='/' element={<HomePage/>}  />   
      <Route path='/auth/user-login' element={<AuthPage/>}  />   
      <Route path='/auth/user-reg' element={<AuthPage/>}  />   
      <Route path='/trips' element={<ProtectedRoute><TripPosts/></ProtectedRoute>}  />   
      <Route path='/myTrips' element={<ProtectedRoute><MyTrips/></ProtectedRoute>}  />   
      <Route path='/trips/create-trip' element={<ProtectedRoute><CreateTrip/></ProtectedRoute>}  />   
      <Route path='/chat/:targetUserId' element={<ProtectedRoute><Chat/></ProtectedRoute>}  />   
      <Route path='/auth/update-profile' element={<ProtectedRoute><UpdateProfile/></ProtectedRoute>}  />   
      <Route path='/traveller-profile/:id' element={<TravellerSocialCard />}  />   
      <Route path='/user-profile/:id' element={<TravellerSocialCard />}  />   
      <Route path='*' element={<NotFound/>}  />   
    </Routes>
    </>
  );
}

export default App;
