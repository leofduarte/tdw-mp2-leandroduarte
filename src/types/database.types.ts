export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chapters: {
        Row: {
          chapter_id: number
          is_ending: boolean | null
          parent_choice_id: number | null
          story_id: number | null
          text: string
          user_id: string
        }
        Insert: {
          chapter_id?: number
          is_ending?: boolean | null
          parent_choice_id?: number | null
          story_id?: number | null
          text: string
          user_id?: string
        }
        Update: {
          chapter_id?: number
          is_ending?: boolean | null
          parent_choice_id?: number | null
          story_id?: number | null
          text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["story_id"]
          },
          {
            foreignKeyName: "fk_parent_choice"
            columns: ["parent_choice_id"]
            isOneToOne: false
            referencedRelation: "choices"
            referencedColumns: ["choice_id"]
          },
        ]
      }
      choices: {
        Row: {
          chapter_id: number | null
          choice_id: number
          next_chapter_id: number | null
          text: string
          user_id: string
          votes: number | null
        }
        Insert: {
          chapter_id?: number | null
          choice_id?: number
          next_chapter_id?: number | null
          text: string
          user_id?: string
          votes?: number | null
        }
        Update: {
          chapter_id?: number | null
          choice_id?: number
          next_chapter_id?: number | null
          text?: string
          user_id?: string
          votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "choices_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["chapter_id"]
          },
          {
            foreignKeyName: "choices_next_chapter_id_fkey"
            columns: ["next_chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["chapter_id"]
          },
        ]
      }
      content_warnings: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      genres: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          created_at: string | null
          creator_id: string | null
          description: string | null
          initial_setup: string | null
          slug: string | null
          story_id: number
          target_age_id: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          initial_setup?: string | null
          slug?: string | null
          story_id?: number
          target_age_id?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          initial_setup?: string | null
          slug?: string | null
          story_id?: number
          target_age_id?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "stories_target_age_id_fkey"
            columns: ["target_age_id"]
            isOneToOne: false
            referencedRelation: "target_ages"
            referencedColumns: ["id"]
          },
        ]
      }
      story_content_warnings: {
        Row: {
          content_warning_id: number
          story_id: number
        }
        Insert: {
          content_warning_id: number
          story_id: number
        }
        Update: {
          content_warning_id?: number
          story_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "story_content_warnings_content_warning_id_fkey"
            columns: ["content_warning_id"]
            isOneToOne: false
            referencedRelation: "content_warnings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_content_warnings_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["story_id"]
          },
        ]
      }
      story_genres: {
        Row: {
          genre_id: number
          story_id: number
        }
        Insert: {
          genre_id: number
          story_id: number
        }
        Update: {
          genre_id?: number
          story_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "story_genres_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_genres_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["story_id"]
          },
        ]
      }
      target_ages: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          username?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          choice_id: number | null
          created_at: string | null
          user_id: string | null
          vote_id: number
        }
        Insert: {
          choice_id?: number | null
          created_at?: string | null
          user_id?: string | null
          vote_id?: number
        }
        Update: {
          choice_id?: number | null
          created_at?: string | null
          user_id?: string | null
          vote_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "votes_choice_id_fkey"
            columns: ["choice_id"]
            isOneToOne: false
            referencedRelation: "choices"
            referencedColumns: ["choice_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
