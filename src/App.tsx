import { BrowserRouter, Routes, Route } from "react-router-dom";
import StoryDetail from "./pages/stories/StoryDetail";
import StoriesList from "./pages/stories/StoriesList";
import StoryRead from "./pages/stories/StoryRead";
import Homepage from "./pages/Homepage";
import StoryInterface from "./pages/stories/StoryInterface";
import Login from "./pages/auth/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="stories" element={<StoriesList />} />
        <Route path="stories/read/:slug" element={<StoryRead />} />
        <Route path="stories/flow/:slug" element={<StoryDetail />} />
        <Route path="story/interface" element={<StoryInterface />} />
      </Routes>
    </BrowserRouter>
  );
}
