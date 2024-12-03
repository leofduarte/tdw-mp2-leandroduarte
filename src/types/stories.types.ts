interface Story {
  story_id: number;
  title: string;
  description: string | null;
  slug: string | null;
  creator_id: string | null;
  created_at: string | null;
  initial_setup: string | null;
  target_age_id: number | null;
  cover_image: string | null;
  story_genres?: {
    genre?: {
      name: string;
    };
  }[];
  target_age?: {
    name: string;
  };
  story_content_warnings?: {
    content_warning?: {
      name: string;
    };
  }[];
}

interface Chapter {
  chapter_id: number;
  story_id: number | null;
  text: string;
  is_ending: boolean | null;
  parent_choice_id: number | null;
  user_id: string;
}

interface Choice {
  choice_id: number;
  chapter_id: number | null;
  text: string;
  user_id: string;
  votes: number | null;
  next_chapter_id: number | null;
}

interface ActiveChapter {
  chapter: Chapter;
  parentChoice: Choice | null;
}

export type {
  Story,
  Chapter,
  Choice,
  ActiveChapter
};