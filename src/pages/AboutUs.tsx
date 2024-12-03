import React from "react";
import { Navbar } from "./Homepage";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutUs: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-[#242424] to-gray-900 min-h-screen text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col items-center gap-12">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-600">
            About StoryApp
          </h1>
          <p className="text-center max-w-2xl text-gray-300 text-xl">
            StoryApp is an interactive storytelling platform that allows you to
            create, manage, and visualize stories with branching narratives.
            Whether you're an aspiring writer or a seasoned storyteller,
            StoryApp provides the tools you need to craft unique and engaging
            stories.
          </p>
          <div className="gap-4 flex flex-col">
            <p className="text-center text-2xl max-w-2xl text-gray-300 font-bold">
              With StoryApp, you can:
            </p>
            <ul className="list-disc list-inside text-gray-300 text-xl">
              <li>
                Create interactive stories with multiple chapters and choices.
              </li>
              <li>
                Visualize your story structure using our integrated flowchart
                view.
              </li>
              <li>
                Manage genres, target ages, and content warnings for your
                stories.
              </li>
              <li>
                Share your stories with others and explore stories created by
                the community.
              </li>
            </ul>
          </div>
          <Link to="/create-story">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 transition text-xl">
              Start Creating
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AboutUs;
