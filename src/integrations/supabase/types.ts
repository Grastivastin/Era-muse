export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      aesthetics: {
        Row: {
          created_at: string
          description: string
          display_order: number
          id: string
          image_url: string | null
          mood_words: string[]
          name: string
          palette: string[]
          tagline: string
        }
        Insert: {
          created_at?: string
          description: string
          display_order?: number
          id: string
          image_url?: string | null
          mood_words?: string[]
          name: string
          palette?: string[]
          tagline: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          image_url?: string | null
          mood_words?: string[]
          name?: string
          palette?: string[]
          tagline?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          added_at: string
          id: string
          mode: string
          product_id: string
          quantity: number
          session_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          mode: string
          product_id: string
          quantity?: number
          session_id: string
        }
        Update: {
          added_at?: string
          id?: string
          mode?: string
          product_id?: string
          quantity?: number
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      era_moodboards: {
        Row: {
          created_at: string
          id: string
          image_queries: string[] | null
          outfit_ideas: Json | null
          prompt: string
          session_id: string
          vibe: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_queries?: string[] | null
          outfit_ideas?: Json | null
          prompt: string
          session_id: string
          vibe?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_queries?: string[] | null
          outfit_ideas?: Json | null
          prompt?: string
          session_id?: string
          vibe?: string | null
        }
        Relationships: []
      }
      eras: {
        Row: {
          created_at: string
          decade: string
          description: string
          display_order: number
          id: string
          image_url: string | null
          manifesto: string
          muse: string
          name: string
          palette: string[]
          tagline: string
        }
        Insert: {
          created_at?: string
          decade: string
          description: string
          display_order?: number
          id: string
          image_url?: string | null
          manifesto: string
          muse: string
          name: string
          palette?: string[]
          tagline: string
        }
        Update: {
          created_at?: string
          decade?: string
          description?: string
          display_order?: number
          id?: string
          image_url?: string | null
          manifesto?: string
          muse?: string
          name?: string
          palette?: string[]
          tagline?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          aesthetic_id: string | null
          available_modes: string[]
          borrow_price: number | null
          buy_price: number | null
          category: string
          created_at: string
          description: string
          era_id: string | null
          id: string
          image_url: string
          name: string
          slug: string
          story: string | null
          tags: string[]
          try_price: number | null
        }
        Insert: {
          aesthetic_id?: string | null
          available_modes?: string[]
          borrow_price?: number | null
          buy_price?: number | null
          category: string
          created_at?: string
          description: string
          era_id?: string | null
          id?: string
          image_url: string
          name: string
          slug: string
          story?: string | null
          tags?: string[]
          try_price?: number | null
        }
        Update: {
          aesthetic_id?: string | null
          available_modes?: string[]
          borrow_price?: number | null
          buy_price?: number | null
          category?: string
          created_at?: string
          description?: string
          era_id?: string | null
          id?: string
          image_url?: string
          name?: string
          slug?: string
          story?: string | null
          tags?: string[]
          try_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_aesthetic_id_fkey"
            columns: ["aesthetic_id"]
            isOneToOne: false
            referencedRelation: "aesthetics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_era_id_fkey"
            columns: ["era_id"]
            isOneToOne: false
            referencedRelation: "eras"
            referencedColumns: ["id"]
          },
        ]
      }
      sage_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sage_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string
          id: string
          selected_era: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          selected_era?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          selected_era?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_selected_era_fkey"
            columns: ["selected_era"]
            isOneToOne: false
            referencedRelation: "eras"
            referencedColumns: ["id"]
          },
        ]
      }
      style_dna: {
        Row: {
          answers: Json
          created_at: string
          era: string
          muse: string
          poem: string
          primary_aesthetic: string
          recent_searches: string[] | null
          secondary_aesthetic: string | null
          session_id: string
          signature_pieces: string[]
        }
        Insert: {
          answers?: Json
          created_at?: string
          era: string
          muse: string
          poem: string
          primary_aesthetic: string
          recent_searches?: string[] | null
          secondary_aesthetic?: string | null
          session_id: string
          signature_pieces?: string[]
        }
        Update: {
          answers?: Json
          created_at?: string
          era?: string
          muse?: string
          poem?: string
          primary_aesthetic?: string
          recent_searches?: string[] | null
          secondary_aesthetic?: string | null
          session_id?: string
          signature_pieces?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "style_dna_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlist_items: {
        Row: {
          added_at: string
          id: string
          product_id: string
          session_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          product_id: string
          session_id: string
        }
        Update: {
          added_at?: string
          id?: string
          product_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
