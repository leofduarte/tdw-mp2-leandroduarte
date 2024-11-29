// src/pages/stories/StoriesList.tsx

import { useDispatch } from "react-redux";
import { setSelectedStory } from "../../slices/storySlice.ts";
import { Story } from "@/types/stories.types.ts";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import supabase from "../../config/supabase-client.ts";
import { useEffect, useState } from "react";

export default function StoriesList() {
  const [data, setData] = useState<Story[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchStories = async () => {
      const { data, error } = await supabase.from("stories").select("*");

      if (error) {
        console.error("Error fetching stories:", error);
      } else {
        setData(data);
      } 
    };
    fetchStories();
  }, []);

  const handleStoryClick = (story: Story) => {
    dispatch(setSelectedStory(story));
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-2xl text-center">Stories</h1>
      {data.map((story) => (
        <Link 
          to={`/stories/flow/${story.slug}`} 
          key={story.story_id} 
          onClick={() => handleStoryClick(story)}
          className="w-[350px] m-4 cursor-pointer hover:shadow-lg transition-shadow"
        >
          <Card>
            <CardHeader>
              <CardTitle>{story.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{story.description}</p>
            </CardContent>
            <CardFooter>
              <p>{story.created_at}</p>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}