import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import supabase from "../config/supabase-client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { BookOpen, PlusCircle, Library, Compass, User2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { clearUser } from "../slices/authSlice";

export const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(clearUser());
  };

  return (
    <nav className="p-4 shadow-lg">
      <div className="container mx-auto grid grid-cols-3 items-center">
        {/* Left - Logo */}
        <div className="justify-self-start">
          <Link
            to="/"
            className="text-white font-bold text-2xl hover:bg-gradient-to-r hover:from-yellow-400 hover:to-pink-600 hover:text-transparent hover:bg-clip-text transition-all duration-300"
          >
            StoryApp
          </Link>
        </div>

        {/* Center - Navigation */}
        <div className="justify-self-center flex items-center space-x-6">
          <Link
            to="/create"
            className="text-white hover:text-yellow-300 transition"
          >
            Create Story
          </Link>
          <Link
            to="/stories"
            className="text-white hover:text-yellow-300 transition"
          >
            Stories Listing
          </Link>
        </div>

        {/* Right - User Section */}
        <div className="justify-self-end flex items-center space-x-6">
          {user ? (
            <>
              <div className="flex flex-col text-end text-sm">
                <span className="text-white">Welcome,</span>
                <span className="text-white">{user.email}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <button className="flex align-middle">
                    <img
                      src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user?.email}`}
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    aria-disabled="true"
                    className="opacity-70 cursor-default hover:bg-transparent"
                  >
                    <span className="text-black">{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <button
                      className="hover:text-red-400 transition"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link
              to="/login"
              onClick={handleLogout}
              className="text-white hover:text-yellow-300 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default function Homepage() {
  const location = useLocation();

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col items-center gap-12 text-white">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-600">
            Welcome to StoryApp
          </h1>
          <p className="text-center max-w-2xl text-gray-300">
            Create interactive stories with branching narratives. Add chapters
            and choices to craft unique storytelling experiences, and visualize
            your story structure with our flowchart view.
          </p>
          <Link to="/create">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 transition">
              Start Creating
            </Button>
          </Link>
        </div>

        {/* Feature Highlights */}
        <section className="mt-20">
          <h2 className="text-3xl font-semibold text-center text-white">
            Features
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center bg-indigo-700 p-6 rounded-lg shadow-lg hover:bg-indigo-600 transition">
              <BookOpen className="mx-auto mb-4 w-12 h-12 text-yellow-300" />
              <h3 className="text-xl font-medium text-white">Create Stories</h3>
              <p className="mt-2 text-gray-200">
                Easily create and manage your interactive stories.
              </p>
            </div>
            <div className="text-center bg-green-700 p-6 rounded-lg shadow-lg hover:bg-green-600 transition">
              <PlusCircle className="mx-auto mb-4 w-12 h-12 text-yellow-300" />
              <h3 className="text-xl font-medium text-white">
                Branching Narratives
              </h3>
              <p className="mt-2 text-gray-200">
                Add multiple choices and paths to make your stories engaging and
                more dynamic.
              </p>
            </div>
            <div className="text-center bg-blue-700 p-6 rounded-lg shadow-lg hover:bg-blue-600 transition">
              <Compass className="mx-auto mb-4 w-12 h-12 text-yellow-300" />
              <h3 className="text-xl font-medium text-white">
                Flowchart Visualization
              </h3>
              <p className="mt-2 text-gray-200">
                Visualize your story structure with our integrated flowchart
                view.
              </p>
            </div>
          </div>
        </section>

        {/* Sample Stories */}
        <section className="mt-20">
          <h2 className="text-3xl font-semibold text-center text-white">
            Sample Stories
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Replace with dynamic content */}
            <div className="border-l-4 border-yellow-400 bg-gray-700 p-6 rounded-lg shadow-md hover:bg-gray-600 transition">
              <h3 className="text-xl font-medium text-yellow-300">
                Adventure in the Mountains
              </h3>
              <p className="mt-2 text-gray-300">
                Join our hero on an epic journey through the rugged mountains.
              </p>
              <Link to="/stories/adventure-mountains">
                <Button className="mt-4 bg-pink-500 hover:bg-pink-600 text-white transition">
                  Read More
                </Button>
              </Link>
            </div>
            <div className="border-l-4 border-green-400 bg-gray-700 p-6 rounded-lg shadow-md hover:bg-gray-600 transition">
              <h3 className="text-xl font-medium text-green-300">
                Mystery of the Lost City
              </h3>
              <p className="mt-2 text-gray-300">
                Uncover the secrets of the ancient lost city.
              </p>
              <Link to="/stories/lost-city">
                <Button className="mt-4 bg-pink-500 hover:bg-pink-600 text-white transition">
                  Read More
                </Button>
              </Link>
            </div>
            <div className="border-l-4 border-blue-400 bg-gray-700 p-6 rounded-lg shadow-md hover:bg-gray-600 transition">
              <h3 className="text-xl font-medium text-blue-300">
                Space Odyssey
              </h3>
              <p className="mt-2 text-gray-300">
                Explore the vastness of space in this thrilling adventure.
              </p>
              <Link to="/stories/space-odyssey">
                <Button className="mt-4 bg-pink-500 hover:bg-pink-600 text-white transition">
                  Read More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Call-to-Action */}
        <section className="mt-20 text-center">
          <h2 className="text-3xl font-semibold text-white">
            Ready to Create Your Story?
          </h2>
          <Link to="/create" className="mt-6 inline-block">
            <Button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 transition">
              Get Started
            </Button>
          </Link>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-8 text-center">
        <p>&copy; MCTW - 24/25 - TDW . José Leandro Duarte 105541</p>
      </footer>
    </div>
  );
}
