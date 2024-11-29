interface Story {
  story_id: number;
  title: string;
  description: string;
  created_at: string | null;
  creator_id: string;
  genre: string | null;
  target_age: string | null;
  content_warnings: string[] | null;
  initial_setup: string | null;
  slug: string | null;
}

interface Chapter {
  chapter_id: number;
  story_id: number;
  text: string;
  is_ending: boolean | null;
  parent_choice_id: number | null;
  user_id: string;
}

interface Choice {
  choice_id: number;
  chapter_id: number;
  text: string;
  next_chapter_id: number | null;
  votes: number | null;
  user_id: string;
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