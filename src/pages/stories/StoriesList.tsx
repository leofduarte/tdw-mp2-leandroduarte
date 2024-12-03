import { useDispatch } from "react-redux";
import supabase from "../../config/supabase-client.ts";
import { setSelectedStory } from "../../slices/storySlice.ts";
import { Story } from "@/types/stories.types.ts";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Brain, GitBranch, ArrowUpDown, Loader2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import placeholder from "../../../public/placeholder.webp";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Navbar } from "../Homepage";

export default function StoriesList() {
  const [data, setData] = useState<Story[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [targetAges, setTargetAges] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleStoryClick = (story: Story) => {
    dispatch(setSelectedStory(story));
  };

  const handleSort = (value: string) => {
    switch (value) {
      case "title":
        setSortField("title");
        setSortDirection("asc");
        break;
      case "created_at":
        setSortField("created_at");
        setSortDirection("desc"); // Latest first
        break;
      case "-created_at":
        setSortField("created_at");
        setSortDirection("asc"); // Oldest first
        break;
    }
  };

  const FilterMenu = ({
    genres,
    targetAges,
    selectedGenres,
    selectedAges,
    onGenreChange,
    onAgeChange,
    onClose,
  }: {
    genres: string[];
    targetAges: string[];
    selectedGenres: string[];
    selectedAges: string[];
    onGenreChange: (genres: string[]) => void;
    onAgeChange: (ages: string[]) => void;
    onClose: () => void;
  }) => (
    <div className="absolute top-full right-0 mt-2 p-4 bg-white rounded-lg shadow-lg z-50 w-80 max-h-[80vh] overflow-hidden ">
      <div className="space-y-4 overflow-y-auto max-h-[calc(60vh-100px)]">
        <div>
          <h3 className="font-semibold mb-2 text-gray-800 sticky top-0 bg-white">
            Genres
          </h3>
          <div className="space-y-2">
            {genres.map((genre) => (
              <Label key={genre} className="flex items-center space-x-2">
                <Checkbox
                  id={`genre-${genre}`}
                  checked={selectedGenres.includes(genre)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onGenreChange([...selectedGenres, genre]);
                    } else {
                      onGenreChange(selectedGenres.filter((g) => g !== genre));
                    }
                  }}
                  className="rounded text-primary"
                />
                <span className="text-sm text-gray-700">{genre}</span>
              </Label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-gray-800 sticky top-0 bg-white">
            Age Groups
          </h3>
          <div className="space-y-2">
            {targetAges.map((age) => (
              <Label key={age} className="flex items-center space-x-2">
                <Checkbox
                  id={`age-${age}`}
                  checked={selectedAges.includes(age)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onAgeChange([...selectedAges, age]);
                    } else {
                      onAgeChange(selectedAges.filter((a) => a !== age));
                    }
                  }}
                  className="rounded text-primary"
                />
                <span className="text-sm text-gray-700">{age}</span>
              </Label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end sticky bottom-0 bg-white pt-2 space-x-2">
        <Button
          variant="destructive"
          onClick={() => {
            onGenreChange([]);
            onAgeChange([]);
          }}
        >
          Clear All
        </Button>
        <Button onClick={onClose}>Apply Filters</Button>
      </div>
    </div>
  );

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const { data: genresData } = await supabase
          .from("genres")
          .select("name");
        const { data: agesData } = await supabase
          .from("target_ages")
          .select("name");

        if (genresData && agesData) {
          setGenres(genresData.map((g) => g.name));
          setTargetAges(agesData.map((a) => a.name));
        }
      } catch (err) {
        console.error("Error fetching filters:", err);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let query = supabase.from("stories").select(`
          *,
          story_genres!inner (
            genre:genres!inner(name)
          ),
          target_age:target_ages!inner(name),
          story_content_warnings(
            content_warning:content_warnings(name)
          )
        `);

        if (selectedGenres.length > 0) {
          query = query.in("story_genres.genre.name", selectedGenres);
        }

        if (selectedAges.length > 0) {
          query = query.in("target_age.name", selectedAges);
        }

        if (searchQuery) {
          query = query.or(
            `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
          );
        }

        query = query.order(sortField, { ascending: sortDirection === "asc" });

        const { data, error } = await query;
        if (error) throw error;
        setData(data as Story[]);
      } catch (err: any) {
        console.error("Error fetching stories:", err);
        setError("Failed to load stories.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStories();
  }, [selectedGenres, selectedAges, sortField, sortDirection, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#242424] to-gray-900">
      <Navbar />
      <div className="p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          Explore Stories
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-end mb-8 space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex items-center">
            <div
              className={`
      overflow-hidden transition-all duration-300 ease-in-out
      ${isSearchVisible ? "w-[300px] opacity-100" : "w-0 opacity-0"}
    `}
            >
              <Input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-gray-800 placeholder:text-gray-500"
              />
            </div>

            <button
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className={`
      p-2 rounded-full hover:bg-gray-100/10 transition-colors
      ${isSearchVisible ? "ml-2" : ""}
    `}
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-4 py-2 bg-white text-gray-800 font-medium rounded-lg flex items-center space-x-2 hover:bg-gray-50"
            >
              <span>Filters</span>
              <span className="text-xs font-medium bg-primary text-black px-2 py-1 rounded-full">
                {selectedGenres.length + selectedAges.length}
              </span>
            </button>

            {isFilterOpen && (
              <FilterMenu
                genres={genres}
                targetAges={targetAges}
                selectedGenres={selectedGenres}
                selectedAges={selectedAges}
                onGenreChange={setSelectedGenres}
                onAgeChange={setSelectedAges}
                onClose={() => setIsFilterOpen(false)}
              />
            )}
          </div>

          <Select defaultValue={sortField} onValueChange={handleSort}>
            <SelectTrigger className="w-[200px] bg-white text-gray-800 flex items-center space-x-2">
              <ArrowUpDown className="h-4 w-4 text-gray-500" />
              <SelectValue placeholder="Sort stories by..." />
            </SelectTrigger>
            <SelectContent className="w-[200px] bg-white">
              <SelectItem
                value="title"
                className="flex items-center space-x-2 py-2 cursor-pointer hover:bg-gray-50"
              >
                <div className="flex flex-col">
                  <span className="font-medium">Alphabetical</span>
                  <span className="text-xs text-gray-500">
                    Sort by title A-Z
                  </span>
                </div>
              </SelectItem>
              <SelectItem
                value="created_at"
                className="flex items-center space-x-2 py-2 cursor-pointer hover:bg-gray-50"
              >
                <div className="flex flex-col">
                  <span className="font-medium">Latest First</span>
                  <span className="text-xs text-gray-500">
                    Sort by creation date
                  </span>
                </div>
              </SelectItem>
              <SelectItem
                value="-created_at"
                className="flex items-center space-x-2 py-2 cursor-pointer hover:bg-gray-50"
              >
                <div className="flex flex-col">
                  <span className="font-medium">Oldest First</span>
                  <span className="text-xs text-gray-500">
                    Sort by creation date
                  </span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center mt-20">
            <Loader2 className="w-10 h-10 text-gray-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 mt-20">{error}</div>
        ) : data.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            No stories found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {data.map((story) => (
              <Card
                key={story.story_id}
                className="shadow-lg hover:shadow-2xl transition-shadow bg-[#242424] duration-300 border border-gray-600 rounded-lg md:min-h-[500px] lg:min-h-[450px]"
              >
                <CardHeader
                  className="h-48 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${story.cover_image || placeholder})`,
                  }}
                >
                  {/* Optional: Overlay or title can be added here */}
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-xl font-semibold text-gray-300">
                    {story.title}
                  </CardTitle>
                  <p className="mt-2 text-gray-50 line-clamp-3">
                    {story.description}
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <div className="w-full p-4 flex flex-col justify-between items-center">
                    <span className="text-sm text-gray-200">
                      {story.story_genres
                        ?.map(
                          (g: { genre?: { name: string } }) => g.genre?.name
                        )
                        .filter(Boolean)
                        .join(", ")}
                      • {story.target_age?.name || ""}
                    </span>
                    <span className="text-sm text-gray-500">
                      {story.created_at
                        ? new Date(story.created_at).toLocaleDateString()
                        : "No date"}
                    </span>
                  </div>
                  <div className="w-full flex text-black">
                    <Link
                      to={`/stories/quiz/${story.slug}`}
                      className="flex-1 text-xl py-2 px-4 text-yellow-500  hover:text-yellow-600 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        handleStoryClick(story);
                        navigate(`/stories/quiz/${story.slug}`);
                      }}
                    >
                      <Button className="bg-pink-500 hover:bg-pink-600 text-white transition">
                        <Brain className="w-4 h-4" />
                        Quiz Mode
                      </Button>
                    </Link>
                    <Link
                      to={`/stories/flow/${story.slug}`}
                      className="flex-1 text-xl py-2 px-4 text-yellow-500 hover:text-yellow-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        handleStoryClick(story);
                        navigate(`/stories/flow/${story.slug}`);
                      }}
                    >
                      <Button className=" bg-pink-500 hover:bg-pink-600 text-white transition">
                        <GitBranch className="w-4 h-4" />
                        Flow Mode
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
