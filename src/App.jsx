/*
  App.jsx
  -------
  Root component — sets up React Router with all routes
  and wraps everything in the Navbar. Pretty standard stuff.
*/

import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import ConnectionNotice from "./components/layout/ConnectionNotice";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import ProjectDetailPage from "./pages/ProjectDetail";
import Opportunities from "./pages/Opportunities";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <div className="min-h-screen bg-surface dark:bg-slate-900 transition-colors duration-200">
      <Navbar />
      <ConnectionNotice />

      <Routes>
        <Route path="/"                element={<Landing />} />
        <Route path="/auth"            element={<Auth />} />
        <Route path="/feed"            element={<Feed />} />
        <Route path="/u/:username"     element={<Profile />} />
        <Route path="/projects"        element={<Projects />} />
        <Route path="/projects/:id"    element={<ProjectDetailPage />} />
        <Route path="/opportunities"   element={<Opportunities />} />
        <Route path="/search"          element={<Search />} />
        <Route path="/notifications"   element={<Notifications />} />
        <Route path="/settings"        element={<Settings />} />
      </Routes>
    </div>
  );
}
