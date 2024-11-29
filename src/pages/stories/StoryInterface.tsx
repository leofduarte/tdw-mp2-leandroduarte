import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen, GitBranch, ArrowRight } from "lucide-react";
import { Story, Chapter, Choice } from "@/types/stories.types";
import supabase from "../../config/supabase-client";

const StoryInterface = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [chapterHistory, setChapterHistory] = useState<Chapter[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [availableNextChapters, setAvailableNextChapters] = useState<Chapter[]>(
    []
  );
  const [isAddingChoice, setIsAddingChoice] = useState(false);
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [newChoiceText, setNewChoiceText] = useState("");
  const [newChapterText, setNewChapterText] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("Session:", session?.user);
      const user = session?.user;

      if (user) {
        setUserId(user.id);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchStoryData = async () => {
      const { data: storyData } = await supabase
        .from("stories")
        .select("*")
        .limit(1)
        .single();

      if (storyData) {
        setStory(storyData);
        const { data: chaptersData } = await supabase
          .from("chapters")
          .select("*")
          .eq("story_id", storyData.story_id);

        if (chaptersData) {
          setChapters(chaptersData);
          const initialChapter = chaptersData.find((c) => !c.parent_choice_id);
          setCurrentChapter(initialChapter || null);
          setChapterHistory([initialChapter || null].filter(Boolean));

          const { data: choicesData } = await supabase
            .from("choices")
            .select("*")
            .in(
              "chapter_id",
              chaptersData.map((c) => c.chapter_id)
            );

          if (choicesData) {
            setChoices(choicesData);
          }
        }
      }
    };
    fetchStoryData();
  }, []);

  const getNextChapters = (choiceId: number) => {
    return chapters.filter((chapter) => chapter.parent_choice_id === choiceId);
  };

  const getCurrentChoices = () => {
    return choices.filter(
      (choice) => choice.chapter_id === currentChapter?.chapter_id
    );
  };

  const handleChoiceSelect = (choice: Choice) => {
    setSelectedChoice(choice);
    const nextChapters = getNextChapters(choice.choice_id);
    if (nextChapters.length > 1) {
      setAvailableNextChapters(nextChapters);
    } else if (nextChapters.length === 1) {
      handleChapterSelect(nextChapters[0]);
    }
  };

  const selectNextChapter = (chapter: Chapter) => {
    handleChapterSelect(chapter);
    setAvailableNextChapters([]);
  };

  const handleChapterSelect = (chapter: Chapter) => {
    setCurrentChapter(chapter);
    setChapterHistory((prev) => [...prev, chapter]);
    setSelectedChoice(null);
  };

  const handleAddChapter = async () => {
    if (!userId) {
      console.error("User ID is not available.");
      return;
    }

    console.log(
      "New Chapter:",
      newChapterText + " - " + selectedChoice?.choice_id
    );
    try {
      const { data, error } = await supabase
        .from("chapters")
        .insert({
          story_id: story?.story_id,
          text: newChapterText,
          parent_choice_id: selectedChoice?.choice_id,
          user_id: userId,
          is_ending: false,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setChapters((prev) => [...prev, data]);
        setNewChapterText("");
        setIsAddingChapter(false);
        handleChapterSelect(data);
      } else {
        console.error("No data returned from the insert operation.");
      }
    } catch (error) {
      console.error("Error adding chapter:", error);
    }
  };

  const handleAddChoice = async () => {
    if (!userId) {
      console.error("User ID is not available.");
      return;
    }
    try {
      const { data, error } = await supabase
        .from("choices")
        .insert({
          chapter_id: currentChapter?.chapter_id,
          text: newChoiceText,
          user_id: userId,
          votes: 0,
        })
        .select()
        .single();

      if (error) throw error;

      setChoices((prev) => [...prev, data]);
      setNewChoiceText("");
      setIsAddingChoice(false);
    } catch (error) {
      console.error("Error adding choice:", error);
    }
  };

  return (
    <div className="flex text-black">
      {/* Left sidebar - Path History */}
      <div className="w-1/4 border-r p-4 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-2 mb-6">
          <GitBranch className="w-5 h-5" />
          <h2 className="font-semibold">Your Story Path</h2>
        </div>
        <div className="space-y-4">
          {chapterHistory.map((chapter, index) => (
            <div key={chapter.chapter_id} className="relative">
              <div className="p-3 bg-white rounded border hover:bg-gray-50">
                <div className="font-medium mb-1">Chapter {index + 1}</div>
                <div className="text-sm text-gray-600">
                  {chapter.text.substring(0, 60)}...
                </div>
              </div>
              {index < chapterHistory.length - 1 && (
                <div className="flex justify-center my-2">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </div>
          ))}

          {selectedChoice && (
            <div className="mt-4">
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <div className="font-medium text-blue-700">
                  Selected Choice:
                </div>
                <div className="text-sm text-blue-600">
                  {selectedChoice.text}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {story?.title || "Loading..."}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Current Chapter */}
            <div className="prose max-w-none mb-8">
              <p className="text-lg">
                {currentChapter?.text || "Loading chapter..."}
              </p>
            </div>

            {/* Choice Selection */}
            {!selectedChoice && currentChapter && (
              <>
                {getCurrentChoices().length > 0 ? (
                  <div className="space-y-4 mb-8">
                    <h3 className="font-semibold">What happens next?</h3>
                    <div className="grid gap-3">
                      {getCurrentChoices().map((choice) => (
                        <Button
                          key={choice.choice_id}
                          variant="outline"
                          className="justify-start text-left"
                          onClick={() => handleChoiceSelect(choice)}
                        >
                          {choice.text}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">The End</h3>
                    <p className="text-gray-600">
                      This branch of the story has ended.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Chapter Selection after Choice */}
            {selectedChoice &&
              getNextChapters(selectedChoice.choice_id).length === 0 && (
                <div className="space-y-4">
                  <div className="text-gray-500">
                    This choice has no continuations yet. Add one to continue
                    the story.
                  </div>
                  {!isAddingChapter ? (
                    <Button
                      className="w-full flex items-center gap-2"
                      onClick={() => setIsAddingChapter(true)}
                    >
                      <PlusCircle className="w-5 h-5" />
                      Add New Chapter
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <textarea
                        className="w-full p-2 border rounded text-white"
                        rows={3}
                        placeholder="Enter your chapter text..."
                        value={newChapterText}
                        onChange={(e) => setNewChapterText(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleAddChapter}>Save Chapter</Button>
                        <Button
                          variant="default"
                          onClick={() => {
                            setIsAddingChapter(false);
                            setNewChapterText("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            {availableNextChapters.length > 1 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Choose the next chapter:</h3>
                <div className="grid gap-3">
                  {availableNextChapters.map((chapter) => (
                    <Button
                      key={chapter.chapter_id}
                      variant="outline"
                      className="justify-start text-left"
                      onClick={() => selectNextChapter(chapter)}
                    >
                      {chapter.text.substring(0, 60)}...
                    </Button>
                  ))}
                </div>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setSelectedChoice(null);
                    setAvailableNextChapters([]);
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}

            {currentChapter && getCurrentChoices().length === 0 && (
              <div className="space-y-4">
                <div className="text-gray-700">
                  This chapter has no choices yet. Add one to continue the
                  story.
                </div>
                {!isAddingChoice ? (
                  <Button
                    className="w-full flex items-center gap-2"
                    onClick={() => setIsAddingChoice(true)}
                  >
                    <PlusCircle className="w-5 h-5" />
                    Add New Choice
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      className="w-full p-2 border rounded text-white"
                      rows={3}
                      placeholder="Enter your choice text..."
                      value={newChoiceText}
                      onChange={(e) => setNewChoiceText(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleAddChoice}>Save Choice</Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setIsAddingChoice(false);
                          setNewChoiceText("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default StoryInterface;
