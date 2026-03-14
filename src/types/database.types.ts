/**
 * Supabase generated types can be added here.
 * For MVP we use a minimal hand-written schema so the app runs without codegen.
 */
export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          age: number;
          life_stage: string;
          personality_traits: string[];
          goals: string;
          fears: string;
          current_struggles: string;
          additional_context: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "id" | "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      future_branches: {
        Row: {
          id: string;
          profile_id: string;
          slug: string;
          title: string;
          age_at_future: number;
          one_liner: string;
          core_values: string[];
          signature_message: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["future_branches"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["future_branches"]["Insert"]>;
      };
      dialogue_sessions: {
        Row: {
          id: string;
          user_id: string;
          profile_id: string;
          question: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["dialogue_sessions"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["dialogue_sessions"]["Insert"]>;
      };
      branch_answers: {
        Row: {
          id: string;
          session_id: string;
          branch_id: string;
          branch_slug: string;
          answer_text: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["branch_answers"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["branch_answers"]["Insert"]>;
      };
    };
  };
}
