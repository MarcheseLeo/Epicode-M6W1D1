import React from "react";
import NavBar from "./components/navbar/BlogNavbar";
import Footer from "./components/footer/Footer";
import Home from "./views/home/Home";
import Blog from "./views/blog/Blog";
import NewBlogPost from "./views/new/New";
import Login from "./views/login/Login";
import MyPosts from "./views/my-posts/MyPosts";
import Register from "./views/register/Register";

import ProtectedRoute from "./components/protectedRoute/ProtectedRoute"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./views/profile/Profile";
import { OauthSuccessPage } from "./views/oauth/success/OauthSuccessPage";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth/success" element= {<OauthSuccessPage/>} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/new" element={<NewBlogPost />} />
          <Route path="/profile" element={<Profile />} /> 
          <Route path="/my-posts" element={<MyPosts />} />
          
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;