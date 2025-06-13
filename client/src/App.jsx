import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from "./pages/About";
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Header from './components/Header';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import CreateList from './pages/CreateList';
import UpdateList from './pages/UpdateList';
import List from './pages/List';
import Search from './pages/Search';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/list/:listId" element={<List />} />
        <Route path="/search" element={<Search />} />

        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />      
          <Route path="/create-list" element={<CreateList />} />      
          <Route path="/update-list/:listId" element={<UpdateList />} />      
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
