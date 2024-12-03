import supabase from "../../config/supabase-client.ts";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FlowChart from "../../components/flowchart.tsx";
import { Chapter, Choice, Story } from "@/types/stories.types.ts";
import dagre from "@dagrejs/dagre";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedStory } from "../../slices/storySlice.ts";
import { RootState } from "../../redux/store.ts";
import SeeMoreChapter from "../../components/seeMore-chapters.tsx";
import Modal from "../../components/modal.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { Navbar } from "../../pages/Homepage";

type StoryResponse = {
  story_id: number;
  title: string;
  description: string;
  creator_id: string;
  created_at: string;
  initial_setup: string;
  target_age_id: number;
  slug: string;
  cover_image: string | null;
};

function StoryDetail() {
  const nodeWidth = 300;
  const nodeHeight = 80;

  const dispatch = useDispatch();
  const { slug } = useParams<{ slug: string }>();

  const selectedStory = useSelector(
    (state: RootState) => state.story.selectedStory
  );

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState<number | null>(null);
  const [newChoices, setNewChoices] = useState<string[]>([""]);
  const [currentChapterText, setCurrentChapterText] = useState("");
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [newChapterText, setNewChapterText] = useState("");
  const [selectedChoiceId, setSelectedChoiceId] = useState<number | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");
      return user.id;
    };

    const fetchStoryData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!slug) throw new Error("Story slug is required");

        let storyData: Story | null = selectedStory;

        if (!storyData || storyData.slug !== slug) {
          const { data: storyResponse, error: storyError } = await supabase
            .from("stories")
            .select(
              "story_id, title, description, creator_id, created_at, initial_setup, target_age_id, slug, cover_image"
            )
            .eq("slug", slug)
            .single<StoryResponse>();

          if (storyError) throw storyError;
          if (!storyResponse) throw new Error("Story not found");

          storyData = {
            story_id: storyResponse.story_id,
            title: storyResponse.title,
            description: storyResponse.description,
            creator_id: storyResponse.creator_id,
            created_at: storyResponse.created_at,
            initial_setup: storyResponse.initial_setup,
            target_age_id: storyResponse.target_age_id,
            slug: storyResponse.slug,
            cover_image: storyResponse.cover_image,
          } as Story;

          dispatch(setSelectedStory(storyData));
        }

        const { data: chaptersData, error: chaptersError } = await supabase
          .from("chapters")
          .select("*")
          .eq("story_id", storyData.story_id);

        if (chaptersError) throw chaptersError;
        setChapters(
          (chaptersData || []).map((chapter) => ({
            ...chapter,
            story_id: chapter.story_id ?? 0,
          }))
        );
        console.log("Fetched Chapters:", chaptersData);

        if (chaptersData?.length) {
          const { data: choicesData, error: choicesError } = await supabase
            .from("choices")
            .select("*")
            .in(
              "chapter_id",
              chaptersData.map((c) => c.chapter_id)
            );

          if (choicesError) throw choicesError;
          setChoices(
            (choicesData || []).map((choice) => ({
              ...choice,
              chapter_id: choice.chapter_id ?? 0,
            }))
          );
          console.log("Fetched Choices:", choicesData);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error : new Error("Unknown error occurred")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoryData();
    getUserId().then((userId) => console.log("User ID:", userId));
  }, [slug, selectedStory, dispatch]);

  // Open Modal to Add Choices
  const openAddChoiceModal = (chapterId: number) => {
    setCurrentChapterId(chapterId);
    setNewChoices([""]);
    setIsChoiceModalOpen(true);
  };

  const openAddChapterModal = (choiceId: number) => {
    setSelectedChoiceId(choiceId);
    setNewChapterText("");
    setIsChapterModalOpen(true);
  };

  const openModalWithText = (text: string) => {
    setCurrentChapterText(text);
    setIsTextModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsTextModalOpen(false);
    setIsChoiceModalOpen(false);
    setIsChapterModalOpen(false);
    setCurrentChapterId(null);
    setSelectedChoiceId(null);
    setNewChoices([""]);
    setCurrentChapterText("");
    setNewChapterText("");
  };

  // Handle Input Change for Choices
  const handleChoiceChange = (index: number, value: string) => {
    const updatedChoices = [...newChoices];
    updatedChoices[index] = value;
    setNewChoices(updatedChoices);
  };

  // Add a new Choice Input Field
  const addChoiceField = () => {
    setNewChoices([...newChoices, ""]);
  };

  // Remove a Choice Input Field
  const removeChoiceField = (index: number) => {
    const updatedChoices = [...newChoices];
    updatedChoices.splice(index, 1);
    setNewChoices(updatedChoices);
  };

  // Submit Choices from Modal
  const submitChoices = async () => {
    if (currentChapterId === null) return;

    const filteredChoices = newChoices.filter((choice) => choice.trim() !== "");

    try {
      const { data, error } = await supabase
        .from("choices")
        .insert(
          filteredChoices.map((choiceText) => ({
            chapter_id: currentChapterId,
            text: choiceText,
            votes: 0,
          }))
        )
        .select();

      if (error) throw error;

      setChoices((prev) => [...prev, ...data]);
      console.log("Added Choices:", data);
      closeModal();
    } catch (error) {
      console.error("Error adding choices:", error);
    }
  };

  const handleAddChoice = (chapterId: number) => {
    openAddChoiceModal(chapterId);
  };

  const handleAddChapter = async (choiceId: number) => {
    openAddChapterModal(choiceId);
  };

  const submitNewChapter = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedChoiceId || !newChapterText.trim()) return;

    try {
      const { data, error } = await supabase
        .from("chapters")
        .insert({
          story_id: selectedStory?.story_id ?? 0,
          text: newChapterText,
          parent_choice_id: selectedChoiceId,
        })
        .select()
        .single();

      if (error) throw error;

      setChapters((prev) => [
        ...prev,
        {
          ...data,
          story_id: data.story_id ?? 0,
        },
      ]);

      console.log("Added Chapter:", data);

      await supabase
        .from("choices")
        .update({ next_chapter_id: data.chapter_id })
        .eq("choice_id", selectedChoiceId);

      setIsChapterModalOpen(false);
      setNewChapterText("");
      setSelectedChoiceId(null);
    } catch (error) {
      console.error("Error adding chapter:", error);
    }
  };

  const getLayoutedElements = (elements: any[]) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    // Force vertical flow with increased spacing
    dagreGraph.setGraph({
      rankdir: "TB",
      nodesep: 150,
      ranksep: 200,
      marginx: 50,
      marginy: 100,
      acyclicer: "greedy",
    });

    // Calculate heights and set ranks
    elements.forEach((el) => {
      if (el.type === "custom") {
        let calculatedHeight = nodeHeight;
        let rank;

        // Calculate height based on node type
        if (el.data?.type === "chapter") {
          const textLength =
            el.data.label?.props?.children?.props?.children?.length || 0;
          calculatedHeight = Math.max(
            nodeHeight,
            Math.min(300, textLength * 0.5)
          );
          rank = el.id.includes("chapter") ? 2 : 1; // Chapters after story
        } else if (el.data?.type === "choice") {
          rank = 3; // Choices always below chapters
        }

        dagreGraph.setNode(el.id, {
          width: nodeWidth,
          height: calculatedHeight,
          rank: rank, // Force ranking order
        });
      } else {
        dagreGraph.setEdge(el.source, el.target, {
          minlen: 1, // Minimum edge length
          weight: 1, // Edge weight for spacing
        });
      }
    });

    dagre.layout(dagreGraph);

    // Apply calculated positions
    return elements.map((el) => {
      if (el.type === "custom") {
        const nodeWithPosition = dagreGraph.node(el.id);
        el.position = {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeWithPosition.height / 2,
        };

        // Add extra vertical spacing for choices
        if (el.data?.type === "choice") {
          el.position.y += 50;
        }
      }
      return el;
    });
  };

  const generateFlowElements = () => {
    if (!selectedStory) return [];
    const elements: any[] = [];
    const processedNodes = new Set<string>();

    elements.push({
      id: "story",
      type: "custom",
      data: { label: selectedStory.title },
      position: { x: 0, y: 0 },
      style: {
        textAlign: "center",
        background: "#0288d1",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "280px",
        minWidth: "150px",
      },
    });
    processedNodes.add("story");

    const addNodesRecursively = (
      parentId: string,
      parentX: number,
      parentY: number,
      level: number
    ) => {
      const filteredChapters = chapters.filter((chapter) =>
        chapter.parent_choice_id
          ? `choice-${chapter.parent_choice_id}` === parentId
          : parentId === "story"
      );

      filteredChapters.forEach((chapter) => {
        const chapterId = `chapter-${chapter.chapter_id}`;

        if (!processedNodes.has(chapterId)) {
          const isLongText = chapter.text.length > 100;
          elements.push({
            id: chapterId,
            type: "custom",
            data: {
              label: isLongText ? (
                <SeeMoreChapter
                  maxHeight={180}
                  className="chapter-text"
                  onOpen={() => openModalWithText(chapter.text)}
                >
                  <div>{chapter.text.substring(0, 100)}...</div>
                </SeeMoreChapter>
              ) : (
                <div className="chapter-text">{chapter.text}</div>
              ),
              type: "chapter",
              onAddChoice: () => openAddChoiceModal(chapter.chapter_id),
            },
            position: { x: parentX, y: parentY },
            style: {
              background: "#00963d",
              padding: "15px",
              borderRadius: "6px",
              maxWidth: "280px",
              minWidth: "150px",
            },
          });

          elements.push({
            id: `edge-${parentId}-${chapterId}`,
            source: parentId,
            target: chapterId,
            animated: false,
            style: { stroke: "#94a3b8" },
          });

          processedNodes.add(chapterId);
          addNodesRecursively(
            chapterId,
            parentX + 100,
            parentY + 100,
            level + 1
          ); // Adjust positions as needed
        }

        const chapterChoices = choices.filter(
          (choice) => choice.chapter_id === chapter.chapter_id
        );
        chapterChoices.forEach((choice) => {
          const choiceId = `choice-${choice.choice_id}`;

          if (!processedNodes.has(choiceId)) {
            elements.push({
              id: choiceId,
              type: "custom",
              data: {
                label: (
                  <div className="choice-text">
                    <div>{choice.text}</div>
                  </div>
                ),
                type: "choice",
                onAddChapter: () => handleAddChapter(choice.choice_id),
              },
              position: { x: parentX, y: parentY },
              style: {
                background: "#eee8a9",
                padding: "12px",
                borderRadius: "6px",
                maxWidth: "280px",
                minWidth: "150px",
              },
            });

            elements.push({
              id: `edge-${chapterId}-${choiceId}`,
              source: chapterId,
              target: choiceId,
              animated: false,
              style: { stroke: "#94a3b8" },
            });

            processedNodes.add(choiceId);
            addNodesRecursively(
              choiceId,
              parentX + 100,
              parentY + 100,
              level + 1
            ); // Adjust positions as needed
          }
        });
      });
    };

    addNodesRecursively("story", 0, 0, 0);

    return getLayoutedElements(elements);
  };

  if (!selectedStory && !isLoading && !error) {
    return (
      <div className="flex justify-center items-center h-screen">
        No story selected
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <Navbar />
      <FlowChart
        initialElements={generateFlowElements()}
        onAddChoice={handleAddChoice}
        onAddChapter={handleAddChapter}
      />

      <Modal
        isOpen={isTextModalOpen}
        onClose={closeModal}
        title="Full Text"
        maxWidth="max-w-2xl"
      >
        <div>{currentChapterText}</div>
      </Modal>

      {/* Modal for Adding Choices */}
      <Modal
        isOpen={isChoiceModalOpen}
        onClose={closeModal}
        title="Add New Choice"
        maxWidth="max-w-2xl"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitChoices();
          }}
        >
          {newChoices.map((choice, index) => (
            <div key={index} className="mb-4 flex items-center">
              <Input
                type="text"
                value={choice}
                onChange={(e) => handleChoiceChange(index, e.target.value)}
                placeholder={`Choice ${index + 1}`}
                className="flex-1 border border-gray-300 rounded px-3 py-2 mr-2 text-black"
                required
              />
              {newChoices.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeChoiceField(index)}
                  className="text-red-500 hover:text-red-700 text-3xl"
                >
                  &times;
                </button>
              )}
            </div>
          ))}

          <Button
            variant="secondary"
            type="button"
            onClick={addChoiceField}
            className="mb-4 hover:underline"
          >
            <Plus />
            Add Another Choice
          </Button>

          <div className="flex justify-end space-x-2">
            <Button variant={"secondary"} type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save Choices
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isChapterModalOpen}
        onClose={closeModal}
        title="Add New Chapter"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={submitNewChapter}>
          <div className="mb-4">
            <textarea
              value={newChapterText}
              onChange={(e) => setNewChapterText(e.target.value)}
              className="w-full h-48 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your chapter here..."
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save Chapter
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default StoryDetail;
