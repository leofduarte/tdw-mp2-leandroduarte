import { useState, useEffect } from "react";
import { Chapter, Story, Choice, ActiveChapter } from "@/types/stories.types";
import supabase from "../../config/supabase-client";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function StoryRead() {
  const [story, setStory] = useState<Story | null>(null);
  const [activeChapters, setActiveChapters] = useState<ActiveChapter[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{
    message: string;
    details?: string;
  } | null>(null);
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!slug) {
        throw new Error("Story slug is required");
      }

      const { data: storyData, error: storyError } = await supabase
        .from("stories")
        .select("*")
        .eq("slug", slug)
        .single();

      console.log("Fetched Story:", storyData);

      if (storyError) {
        throw new Error(`Failed to fetch story: ${storyError.message}`);
      }
      if (!storyData) {
        throw new Error("Story not found");
      }
      setStory(storyData);

      // Fetch chapters with error handling
      const { data: chaptersData, error: chaptersError } = await supabase
        .from("chapters")
        .select("*")
        .eq("story_id", storyData.story_id);

      console.log("Fetched Chapters:", chaptersData);

      if (chaptersError) {
        throw new Error(`Failed to fetch chapters: ${chaptersError.message}`);
      }

      const validChapters = chaptersData || [];
      if (validChapters.length === 0) {
        throw new Error("This story has no chapters yet");
      }
      setChapters(validChapters);

      const initialChapter = validChapters.find((c) => !c.parent_choice_id);
      console.log("Initial Chapter:", initialChapter);

      if (!initialChapter) {
        throw new Error("No starting chapter found");
      }
      setActiveChapters([{ chapter: initialChapter, parentChoice: null }]);

      const { data: choicesData, error: choicesError } = await supabase
        .from("choices")
        .select("*")
        .in(
          "chapter_id",
          validChapters.map((c) => c.chapter_id)
        );

      console.log("Fetched Choices:", choicesData);

      if (choicesError) {
        throw new Error(`Failed to fetch choices: ${choicesError.message}`);
      }

      setChoices(choicesData || []);
    } catch (err) {
      const error = err as Error;
      console.error("Fetch Data Error:", error);
      setError({
        message: "Failed to load story",
        details: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  const handleChoiceSelection = (choice: Choice) => {
    if (!choice.choice_id) {
      console.warn("Choice has no ID:", choice);
      return;
    }

    console.log("Selected Choice:", choice);
    console.log(
      "Attempting to find chapter with parent_choice_id:",
      choice.choice_id
    );

    const nextChapter = chapters.find(
      (c) => c.parent_choice_id === choice.choice_id
    );

    console.log("Found Next Chapter:", nextChapter);

    if (nextChapter) {
      if (
        !activeChapters.find(
          (ac) => ac.chapter.chapter_id === nextChapter.chapter_id
        )
      ) {
        setActiveChapters((prev) => [
          ...prev,
          { chapter: nextChapter, parentChoice: choice },
        ]);
      }
      setTimeout(() => {
        const element = document.getElementById(
          `chapter-${nextChapter.chapter_id}`
        );
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      console.error("Next chapter not found for choice ID:", choice.choice_id);
      setError({
        message: "Chapter not found",
        details: `Next chapter for choice "${choice.text}" not found.`,
      });
    }
  };

  const renderChapter = (activeChapter: ActiveChapter) => {
    const { chapter, parentChoice } = activeChapter;
    const chapterChoices = choices.filter(
      (choice) => choice.chapter_id === chapter.chapter_id
    );

    return (
      <div
        key={chapter.chapter_id}
        id={`chapter-${chapter.chapter_id}`}
        className="flex flex-col gap-4 mb-8 w-full md:w-1/2 lg:w-1/3"
      >
        <Card>
          <CardContent className="p-6">
            {parentChoice && (
              <div className="mb-2 text-sm text-blue-500">
                <strong>Chosen Path:</strong> {parentChoice.text}
              </div>
            )}
            <p className="text-lg leading-relaxed whitespace-pre-wrap">
              {chapter.text}
            </p>
          </CardContent>
        </Card>

        {chapterChoices.length > 0 ? (
          <div className="space-y-4">
            {chapterChoices.map((choice) => (
              <Button
                key={choice.choice_id}
                variant="outline"
                className="w-full text-left justify-start h-auto p-4 text-black"
                onClick={() => handleChoiceSelection(choice)}
              >
                {choice.text}
              </Button>
            ))}
          </div>
        ) : chapter.is_ending ? (
          <div className="mt-8 p-4 bg-neutral-100 rounded-lg">
            <p className="text-center font-semibold">The End</p>
          </div>
        ) : (
          <p className="text-center text-neutral-500">No choices available</p>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center min-h-screen">
        <p className="text-lg">Loading story...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center min-h-screen p-4">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">{error.message}</p>
          {error.details && <p className="text-sm mt-2">{error.details}</p>}
        </div>
        <div className="flex gap-4">
          <Button onClick={() => fetchData()}>Try Again</Button>
          <Button variant="outline" onClick={() => navigate("/stories")}>
            Back to Stories
          </Button>
        </div>
      </div>
    );
  }

  if (!story || activeChapters.length === 0) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center min-h-screen p-4">
        <p className="text-lg">Story not found</p>
        <Button variant="outline" onClick={() => navigate("/stories")}>
          Back to Stories
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">{story.title}</h1>

      <div className="flex flex-wrap gap-8">
        {activeChapters.map((activeChapter) => renderChapter(activeChapter))}
      </div>
    </div>
  );
}

export default StoryRead;
