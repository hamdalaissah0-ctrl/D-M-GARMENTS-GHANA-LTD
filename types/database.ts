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
    PostgrestVersion: "14.18"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_value: Json | null
          old_value: Json | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_value?: Json | null
          old_value?: Json | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_value?: Json | null
          old_value?: Json | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: string | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          available_sizes: string[]
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          available_sizes?: string[]
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          available_sizes?: string[]
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: []
      }
      category_images: {
        Row: {
          alt_text: string | null
          category_id: string
          created_at: string
          id: string
          sort_order: number
          storage_path: string
        }
        Insert: {
          alt_text?: string | null
          category_id: string
          created_at?: string
          id?: string
          sort_order?: number
          storage_path: string
        }
        Update: {
          alt_text?: string | null
          category_id?: string
          created_at?: string
          id?: string
          sort_order?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_images_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      communications: {
        Row: {
          channel: Database["public"]["Enums"]["communication_channel"]
          created_at: string
          customer_id: string
          id: string
          next_action: string | null
          occurred_at: string
          order_id: string | null
          outcome: string | null
          staff_id: string
          summary: string
        }
        Insert: {
          channel: Database["public"]["Enums"]["communication_channel"]
          created_at?: string
          customer_id: string
          id?: string
          next_action?: string | null
          occurred_at?: string
          order_id?: string | null
          outcome?: string | null
          staff_id: string
          summary: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["communication_channel"]
          created_at?: string
          customer_id?: string
          id?: string
          next_action?: string | null
          occurred_at?: string
          order_id?: string | null
          outcome?: string | null
          staff_id?: string
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "communications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      company_profile: {
        Row: {
          address: string | null
          brand_color_hex: string
          business_hours: Json | null
          company_name: string
          email: string | null
          footer_text: string | null
          id: number
          logo_url: string | null
          no_moq: boolean
          phone_primary: string | null
          phone_secondary: string | null
          social_links: Json
          updated_at: string
          updated_by: string | null
          whatsapp_number: string | null
        }
        Insert: {
          address?: string | null
          brand_color_hex?: string
          business_hours?: Json | null
          company_name?: string
          email?: string | null
          footer_text?: string | null
          id?: number
          logo_url?: string | null
          no_moq?: boolean
          phone_primary?: string | null
          phone_secondary?: string | null
          social_links?: Json
          updated_at?: string
          updated_by?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          address?: string | null
          brand_color_hex?: string
          business_hours?: Json | null
          company_name?: string
          email?: string | null
          footer_text?: string | null
          id?: number
          logo_url?: string | null
          no_moq?: boolean
          phone_primary?: string | null
          phone_secondary?: string | null
          social_links?: Json
          updated_at?: string
          updated_by?: string | null
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_profile_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          handled: boolean
          handled_by: string | null
          id: string
          message: string
          phone: string | null
          source: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          handled?: boolean
          handled_by?: string | null
          id?: string
          message: string
          phone?: string | null
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          handled?: boolean
          handled_by?: string | null
          id?: string
          message?: string
          phone?: string | null
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_submissions_handled_by_fkey"
            columns: ["handled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_contacts: {
        Row: {
          channel: Database["public"]["Enums"]["communication_channel"]
          created_at: string
          customer_id: string
          id: string
          is_primary: boolean
          value: string
        }
        Insert: {
          channel: Database["public"]["Enums"]["communication_channel"]
          created_at?: string
          customer_id: string
          id?: string
          is_primary?: boolean
          value: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["communication_channel"]
          created_at?: string
          customer_id?: string
          id?: string
          is_primary?: boolean
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_contacts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          alternative_phone: string | null
          company_name: string | null
          created_at: string
          customer_type: string | null
          email: string | null
          full_name: string
          id: string
          location: string | null
          notes: string | null
          phone: string | null
          source: Database["public"]["Enums"]["order_source"]
          updated_at: string
          whatsapp_phone: string | null
        }
        Insert: {
          alternative_phone?: string | null
          company_name?: string | null
          created_at?: string
          customer_type?: string | null
          email?: string | null
          full_name: string
          id?: string
          location?: string | null
          notes?: string | null
          phone?: string | null
          source?: Database["public"]["Enums"]["order_source"]
          updated_at?: string
          whatsapp_phone?: string | null
        }
        Update: {
          alternative_phone?: string | null
          company_name?: string | null
          created_at?: string
          customer_type?: string | null
          email?: string | null
          full_name?: string
          id?: string
          location?: string | null
          notes?: string | null
          phone?: string | null
          source?: Database["public"]["Enums"]["order_source"]
          updated_at?: string
          whatsapp_phone?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          id: string
          question: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          id?: string
          question: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          id?: string
          question?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: []
      }
      industries: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: []
      }
      notification_events: {
        Row: {
          attempt_count: number
          channel: Database["public"]["Enums"]["notification_channel"]
          contact_submission_id: string | null
          created_at: string
          error_message: string | null
          id: string
          last_attempt_at: string | null
          order_id: string | null
          payload: Json
          recipient: string
          status: Database["public"]["Enums"]["notification_status"]
          template: string
        }
        Insert: {
          attempt_count?: number
          channel: Database["public"]["Enums"]["notification_channel"]
          contact_submission_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          last_attempt_at?: string | null
          order_id?: string | null
          payload?: Json
          recipient: string
          status?: Database["public"]["Enums"]["notification_status"]
          template: string
        }
        Update: {
          attempt_count?: number
          channel?: Database["public"]["Enums"]["notification_channel"]
          contact_submission_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          last_attempt_at?: string | null
          order_id?: string | null
          payload?: Json
          recipient?: string
          status?: Database["public"]["Enums"]["notification_status"]
          template?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_events_contact_submission_id_fkey"
            columns: ["contact_submission_id"]
            isOneToOne: false
            referencedRelation: "contact_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          assigned_to: string
          id: string
          note: string | null
          order_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          assigned_to: string
          id?: string
          note?: string | null
          order_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          assigned_to?: string
          id?: string
          note?: string | null
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_assignments_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_assignments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_files: {
        Row: {
          checksum: string | null
          id: string
          mime_type: string
          order_id: string
          original_filename: string
          size_bytes: number
          storage_path: string
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          checksum?: string | null
          id?: string
          mime_type: string
          order_id: string
          original_filename: string
          size_bytes: number
          storage_path: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          checksum?: string | null
          id?: string
          mime_type?: string
          order_id?: string
          original_filename?: string
          size_bytes?: number
          storage_path?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_files_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_description_snapshot: string | null
          product_id: string | null
          product_name_snapshot: string
          quantity: number
          selected_options_snapshot: Json
          sort_order: number
        }
        Insert: {
          id?: string
          order_id: string
          product_description_snapshot?: string | null
          product_id?: string | null
          product_name_snapshot: string
          quantity: number
          selected_options_snapshot?: Json
          sort_order?: number
        }
        Update: {
          id?: string
          order_id?: string
          product_description_snapshot?: string | null
          product_id?: string | null
          product_name_snapshot?: string
          quantity?: number
          selected_options_snapshot?: Json
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_notes: {
        Row: {
          created_at: string
          id: string
          note: string
          order_id: string
          staff_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note: string
          order_id: string
          staff_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string
          order_id?: string
          staff_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_notes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_notes_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          from_status: Database["public"]["Enums"]["order_status"] | null
          id: string
          note: string | null
          order_id: string
          to_status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          from_status?: Database["public"]["Enums"]["order_status"] | null
          id?: string
          note?: string | null
          order_id: string
          to_status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          from_status?: Database["public"]["Enums"]["order_status"] | null
          id?: string
          note?: string | null
          order_id?: string
          to_status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          assigned_to: string | null
          created_at: string
          customer_description: string | null
          customer_id: string
          delivery_location: string | null
          follow_up_reason: string | null
          id: string
          idempotency_key: string | null
          next_follow_up_at: string | null
          order_number: string
          preferred_deadline: string | null
          priority: Database["public"]["Enums"]["order_priority"]
          source: Database["public"]["Enums"]["order_source"]
          status: Database["public"]["Enums"]["order_status"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          customer_description?: string | null
          customer_id: string
          delivery_location?: string | null
          follow_up_reason?: string | null
          id?: string
          idempotency_key?: string | null
          next_follow_up_at?: string | null
          order_number?: string
          preferred_deadline?: string | null
          priority?: Database["public"]["Enums"]["order_priority"]
          source?: Database["public"]["Enums"]["order_source"]
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          customer_description?: string | null
          customer_id?: string
          delivery_location?: string | null
          follow_up_reason?: string | null
          id?: string
          idempotency_key?: string | null
          next_follow_up_at?: string | null
          order_number?: string
          preferred_deadline?: string | null
          priority?: Database["public"]["Enums"]["order_priority"]
          source?: Database["public"]["Enums"]["order_source"]
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content: Json | null
          created_at: string
          id: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          id?: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          id?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_images: {
        Row: {
          alt_text: string | null
          id: string
          portfolio_project_id: string
          sort_order: number
          storage_path: string
        }
        Insert: {
          alt_text?: string | null
          id?: string
          portfolio_project_id: string
          sort_order?: number
          storage_path: string
        }
        Update: {
          alt_text?: string | null
          id?: string
          portfolio_project_id?: string
          sort_order?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_images_portfolio_project_id_fkey"
            columns: ["portfolio_project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_projects: {
        Row: {
          created_at: string
          description: string | null
          featured: boolean
          id: string
          industry: string | null
          services: string[] | null
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
          year: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          industry?: string | null
          services?: string[] | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          industry?: string | null
          services?: string[] | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      product_features: {
        Row: {
          id: string
          label: string
          product_id: string
          sort_order: number
        }
        Insert: {
          id?: string
          label: string
          product_id: string
          sort_order?: number
        }
        Update: {
          id?: string
          label?: string
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_features_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          id: string
          product_id: string
          sort_order: number
          storage_path: string
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          product_id: string
          sort_order?: number
          storage_path: string
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          product_id?: string
          sort_order?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_options: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          label: string
          option_type: string
          product_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          label: string
          option_type: string
          product_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          option_type?: string
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_options_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          featured: boolean
          id: string
          minimum_quantity: number | null
          name: string
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["product_status"]
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          minimum_quantity?: number | null
          name: string
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          minimum_quantity?: number | null
          name?: string
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active: boolean
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["staff_role"]
          updated_at: string
        }
        Insert: {
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          full_name: string
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["staff_role"]
          updated_at?: string
        }
        Update: {
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["staff_role"]
          updated_at?: string
        }
        Relationships: []
      }
      quote_items: {
        Row: {
          description: string
          id: string
          line_total: number
          quantity: number
          quote_id: string
          sort_order: number
          unit_price: number
        }
        Insert: {
          description: string
          id?: string
          line_total: number
          quantity: number
          quote_id: string
          sort_order?: number
          unit_price: number
        }
        Update: {
          description?: string
          id?: string
          line_total?: number
          quantity?: number
          quote_id?: string
          sort_order?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          accepted_at: string | null
          created_at: string
          created_by: string | null
          currency: string
          discount: number
          id: string
          notes: string | null
          order_id: string
          quote_number: string
          sent_at: string | null
          status: Database["public"]["Enums"]["quote_status"]
          subtotal: number
          tax: number
          total: number
          validity_days: number
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          discount?: number
          id?: string
          notes?: string | null
          order_id: string
          quote_number?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["quote_status"]
          subtotal?: number
          tax?: number
          total?: number
          validity_days?: number
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          discount?: number
          id?: string
          notes?: string | null
          order_id?: string
          quote_number?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["quote_status"]
          subtotal?: number
          tax?: number
          total?: number
          validity_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "quotes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limit_events: {
        Row: {
          bucket_key: string
          created_at: string
          id: number
        }
        Insert: {
          bucket_key: string
          created_at?: string
          id?: number
        }
        Update: {
          bucket_key?: string
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      redirects: {
        Row: {
          created_at: string
          id: string
          new_path: string
          old_path: string
          status_code: number
        }
        Insert: {
          created_at?: string
          id?: string
          new_path: string
          old_path: string
          status_code?: number
        }
        Update: {
          created_at?: string
          id?: string
          new_path?: string
          old_path?: string
          status_code?: number
        }
        Relationships: []
      }
      seo_pages: {
        Row: {
          canonical_url: string | null
          created_at: string
          id: string
          meta_description: string | null
          og_image_url: string | null
          path: string
          status: Database["public"]["Enums"]["content_status"]
          structured_data: Json | null
          title: string | null
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          meta_description?: string | null
          og_image_url?: string | null
          path: string
          status?: Database["public"]["Enums"]["content_status"]
          structured_data?: Json | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          meta_description?: string | null
          og_image_url?: string | null
          path?: string
          status?: Database["public"]["Enums"]["content_status"]
          structured_data?: Json | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "site_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          company_name: string | null
          created_at: string
          customer_name: string
          id: string
          image_url: string | null
          quote: string
          rating: number | null
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          customer_name: string
          id?: string
          image_url?: string | null
          quote: string
          rating?: number | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
        }
        Update: {
          company_name?: string | null
          created_at?: string
          customer_name?: string
          id?: string
          image_url?: string | null
          quote?: string
          rating?: number | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_bucket_key: string
          p_max_requests: number
          p_window_seconds: number
        }
        Returns: boolean
      }
      current_staff_role: {
        Args: never
        Returns: Database["public"]["Enums"]["staff_role"]
      }
      generate_order_number: { Args: never; Returns: string }
      generate_quote_number: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
      submit_contact_request: {
        Args: {
          p_email: string
          p_full_name: string
          p_message: string
          p_phone: string
          p_source?: string
        }
        Returns: string
      }
      submit_order_request: {
        Args: {
          p_company_name: string
          p_customer_description: string
          p_delivery_location?: string
          p_email: string
          p_full_name: string
          p_idempotency_key: string
          p_items: Json
          p_location: string
          p_phone: string
          p_preferred_deadline?: string
          p_source?: Database["public"]["Enums"]["order_source"]
          p_whatsapp_phone: string
        }
        Returns: {
          order_id: string
          order_number: string
        }[]
      }
      track_order_request: {
        Args: { p_order_number: string; p_phone: string }
        Returns: {
          created_at: string
          history: Json
          item_count: number
          order_number: string
          preferred_deadline: string
          status: Database["public"]["Enums"]["order_status"]
        }[]
      }
    }
    Enums: {
      communication_channel: "call" | "whatsapp" | "sms" | "email" | "in_person"
      content_status: "draft" | "published" | "archived"
      notification_channel: "sms" | "whatsapp" | "email"
      notification_status: "pending" | "sent" | "failed" | "retrying"
      order_priority: "normal" | "high" | "urgent"
      order_source:
        | "website"
        | "phone"
        | "whatsapp"
        | "walk_in"
        | "referral"
        | "other"
      order_status:
        | "new"
        | "reviewing"
        | "contact_required"
        | "contacted"
        | "requirements_confirmed"
        | "quotation_pending"
        | "quotation_sent"
        | "negotiating"
        | "approved"
        | "production_pending"
        | "in_production"
        | "quality_check"
        | "ready"
        | "completed"
        | "cancelled"
        | "archived"
      product_status: "active" | "inactive" | "archived"
      quote_status: "draft" | "sent" | "accepted" | "rejected" | "expired"
      staff_role: "super_admin" | "admin" | "sales" | "production" | "viewer"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      communication_channel: ["call", "whatsapp", "sms", "email", "in_person"],
      content_status: ["draft", "published", "archived"],
      notification_channel: ["sms", "whatsapp", "email"],
      notification_status: ["pending", "sent", "failed", "retrying"],
      order_priority: ["normal", "high", "urgent"],
      order_source: [
        "website",
        "phone",
        "whatsapp",
        "walk_in",
        "referral",
        "other",
      ],
      order_status: [
        "new",
        "reviewing",
        "contact_required",
        "contacted",
        "requirements_confirmed",
        "quotation_pending",
        "quotation_sent",
        "negotiating",
        "approved",
        "production_pending",
        "in_production",
        "quality_check",
        "ready",
        "completed",
        "cancelled",
        "archived",
      ],
      product_status: ["active", "inactive", "archived"],
      quote_status: ["draft", "sent", "accepted", "rejected", "expired"],
      staff_role: ["super_admin", "admin", "sales", "production", "viewer"],
    },
  },
} as const
