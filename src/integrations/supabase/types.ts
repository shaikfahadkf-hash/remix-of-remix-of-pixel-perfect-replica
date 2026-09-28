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
      admin_activity_log: {
        Row: {
          action: string
          created_at: string
          details: string | null
          id: string
          user_email: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: string | null
          id?: string
          user_email?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: string | null
          id?: string
          user_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      event_tracks: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          sort_order: number
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          sort_order?: number
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      gallery: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          image_url: string
          sort_order: number
          title: string | null
          updated_at: string
          visible: boolean
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          sort_order?: number
          title?: string | null
          updated_at?: string
          visible?: boolean
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number
          title?: string | null
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      judges: {
        Row: {
          bio: string | null
          created_at: string
          designation: string | null
          id: string
          image_url: string | null
          linkedin_url: string | null
          name: string
          organization: string | null
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          bio?: string | null
          created_at?: string
          designation?: string | null
          id?: string
          image_url?: string | null
          linkedin_url?: string | null
          name: string
          organization?: string | null
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          bio?: string | null
          created_at?: string
          designation?: string | null
          id?: string
          image_url?: string | null
          linkedin_url?: string | null
          name?: string
          organization?: string | null
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      mentors: {
        Row: {
          bio: string | null
          created_at: string
          designation: string | null
          id: string
          image_url: string | null
          linkedin_url: string | null
          name: string
          organization: string | null
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          bio?: string | null
          created_at?: string
          designation?: string | null
          id?: string
          image_url?: string | null
          linkedin_url?: string | null
          name: string
          organization?: string | null
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          bio?: string | null
          created_at?: string
          designation?: string | null
          id?: string
          image_url?: string | null
          linkedin_url?: string | null
          name?: string
          organization?: string | null
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          designation: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          designation?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          designation?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      registrations: {
        Row: {
          college: string
          created_at: string
          deck_path: string | null
          email: string
          id: string
          leader_name: string
          notes: string | null
          payment_status: string
          phone: string
          stage: string
          status: string
          team_name: string
          team_size: number
        }
        Insert: {
          college: string
          created_at?: string
          deck_path?: string | null
          email: string
          id?: string
          leader_name: string
          notes?: string | null
          payment_status?: string
          phone: string
          stage: string
          status?: string
          team_name: string
          team_size?: number
        }
        Update: {
          college?: string
          created_at?: string
          deck_path?: string | null
          email?: string
          id?: string
          leader_name?: string
          notes?: string | null
          payment_status?: string
          phone?: string
          stage?: string
          status?: string
          team_name?: string
          team_size?: number
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          announcement: string | null
          deadline: string
          fee: number
          id: number
          registrations_open: boolean
          updated_at: string
        }
        Insert: {
          announcement?: string | null
          deadline?: string
          fee?: number
          id?: number
          registrations_open?: boolean
          updated_at?: string
        }
        Update: {
          announcement?: string | null
          deadline?: string
          fee?: number
          id?: number
          registrations_open?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      sponsor_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          sort_order: number
          visible: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sort_order?: number
          visible?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
          visible?: boolean
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          category_id: string | null
          clicks: number
          created_at: string
          featured: boolean
          id: string
          logo_url: string | null
          name: string
          sort_order: number
          visible: boolean
          website_url: string | null
        }
        Insert: {
          category_id?: string | null
          clicks?: number
          created_at?: string
          featured?: boolean
          id?: string
          logo_url?: string | null
          name: string
          sort_order?: number
          visible?: boolean
          website_url?: string | null
        }
        Update: {
          category_id?: string | null
          clicks?: number
          created_at?: string
          featured?: boolean
          id?: string
          logo_url?: string | null
          name?: string
          sort_order?: number
          visible?: boolean
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsors_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "sponsor_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      website_content: {
        Row: {
          key: string
          label: string | null
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          label?: string | null
          updated_at?: string
          value?: string
        }
        Update: {
          key?: string
          label?: string | null
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      winners: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          position: string | null
          prize: string | null
          sort_order: number
          startup_idea: string | null
          team_name: string
          updated_at: string
          visible: boolean
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          position?: string | null
          prize?: string | null
          sort_order?: number
          startup_idea?: string | null
          team_name: string
          updated_at?: string
          visible?: boolean
          year?: number
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          position?: string | null
          prize?: string | null
          sort_order?: number
          startup_idea?: string | null
          team_name?: string
          updated_at?: string
          visible?: boolean
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_first_admin: { Args: never; Returns: boolean }
      grant_admin_by_email: {
        Args: { _email: string; _super: boolean }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      list_admins: {
        Args: never
        Returns: {
          email: string
          roles: string[]
          user_id: string
        }[]
      }
      track_sponsor_click: { Args: { _id: string }; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "user" | "super_admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "super_admin"],
    },
  },
} as const
