import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import supabase from "../../config/supabase-client.ts";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "../Homepage";

interface FormData {
  title: string;
  description: string;
  genres: { id: number; name: string }[];
  targetAge: { id: number; name: string } | null;
  contentWarnings: { id: number; name: string } | null;
  initialSetup: string;
}

export default function StoryCreate() {
  const navigate = useNavigate();
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [targetAges, setTargetAges] = useState<{ id: number; name: string }[]>(
    []
  );
  const [contentWarnings, setContentWarnings] = useState<
    { id: number; name: string }[]
  >([]);
  const [filteredGenres, setFilteredGenres] = useState<
    { id: number; name: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    genres: [],
    targetAge: null,
    contentWarnings: null,
    initialSetup: "",
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // Fetch genres
        const { data: genresData, error: genresError } = await supabase
          .from("genres")
          .select("id, name");

        if (genresError) throw genresError;
        setGenres(genresData || []);
        setFilteredGenres(genresData || []);

        // Fetch target ages
        const { data: agesData, error: agesError } = await supabase
          .from("target_ages")
          .select("id, name");

        if (agesError) throw agesError;
        setTargetAges(agesData || []);

        const { data: warningsData, error: warningsError } = await supabase
          .from("content_warnings")
          .select("id, name");

        if (warningsError) throw warningsError;
        setContentWarnings(warningsData || []);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };

    fetchMetadata();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (
    name: string,
    value: { id: number; name: string }
  ) => {
    if (name === "genres") {
      setFormData((prev) => ({
        ...prev,
        genres: prev.genres.some((item) => item.id === value.id)
          ? prev.genres.filter((item) => item.id !== value.id)
          : [...prev.genres, value],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // 1. Create story
      const storyData = {
        title: formData.title,
        description: formData.description,
        initial_setup: formData.initialSetup || null,
        creator_id: user.id,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        target_age_id: formData.targetAge?.id || null,
      };

      const { data: storyResult, error: storyError } = await supabase
        .from("stories")
        .insert(storyData)
        .select()
        .single();

      if (storyError) throw storyError;

      // 2. Insert genres using junction table
      if (formData.genres.length > 0) {
        const { error: genresError } = await supabase
          .from("story_genres")
          .insert(
            formData.genres.map((genre) => ({
              story_id: storyResult.story_id,
              genre_id: genre.id,
            }))
          );

        if (genresError) throw genresError;
      }

      // 3. Insert content warnings if selected
      if (formData.contentWarnings) {
        const { error: warningError } = await supabase
          .from("story_content_warnings")
          .insert({
            story_id: storyResult.story_id,
            content_warning_id: formData.contentWarnings.id,
          });

        if (warningError) throw warningError;
      }

      // 4. Insert initial chapter
      if (formData.initialSetup) {
        const { error: chapterError } = await supabase.from("chapters").insert({
          story_id: storyResult.story_id,
          text: formData.initialSetup,
          user_id: user.id,
          is_ending: false,
          parent_choice_id: null,
        });

        if (chapterError) throw chapterError;
      }

      navigate(`/stories/flow/${storyResult.slug}`);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create story"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <div className="bg-gradient-to-b from-[#242424] to-gray-900">

      <Navbar />
      <div className="py-8 mx-auto flex flex-col place-content-center justify-center max-w-screen-lg w-full max-h-min">
        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle className="text-white">Create New Story</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white" htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white" htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="h-24"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white" htmlFor="genres">Genres *</Label>
                <Select
                  onValueChange={(value) => {
                    handleSelectChange("genres", JSON.parse(value)),
                      console.log("value", value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select genres">
                      {formData.genres.length > 0
                        ? `${formData.genres.length} selected`
                        : "Select genres"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <div className="sticky top-0 p-2 bg-white">
                      <Input
                        placeholder="Search genres..."
                        className="h-8"
                        onChange={(e) => {
                          const searchValue = e.target.value.toLowerCase();
                          setFilteredGenres(
                            genres.filter((genre) =>
                              genre.name.toLowerCase().includes(searchValue)
                            )
                          );
                        }}
                        onKeyDown={(e) => {
                          e.stopPropagation();
                        }}
                      />
                    </div>
                    {filteredGenres.map((genre) => {
                      const isSelected = formData.genres.some(
                        (g) => g.id === genre.id
                      );
                      return (
                        <SelectItem
                          key={genre.id}
                          value={JSON.stringify(genre)}
                          className={`flex items-center justify-between ${
                            isSelected ? "bg-neutral-200" : ""
                          }`}
                        >
                          {genre.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-neutral-100 text-neutral-900 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label  className="text-white" htmlFor="targetAge">Target Age *</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("targetAge", JSON.parse(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target age" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetAges.map((age) => (
                      <SelectItem key={age.id} value={JSON.stringify(age)}>
                        {age.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white" htmlFor="contentWarnings">Content Warnings</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("contentWarnings", JSON.parse(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select content warnings" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentWarnings.map((warning) => (
                      <SelectItem
                        key={warning.id}
                        value={JSON.stringify(warning)}
                      >
                        {warning.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <h2 className="text-xl font-semibold tracking-tight text-white">
                  Initial Setup
                </h2>
                <h3 className="font-medium tracking-tight text-gray-200">
                  Write the first chapter of your story
                </h3>
              </div>

              <div className="space-y-2 mt-2">
                <Label  className="text-white" htmlFor="initialSetup">1st Chapter</Label>
                <Textarea
                  id="initialSetup"
                  name="initialSetup"
                  value={formData.initialSetup}
                  onChange={handleChange}
                  className="h-24"
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/stories")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Story"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
