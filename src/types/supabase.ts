export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      categories: {
        Row: {
          aliases: string[];
          color: string;
          created_at: string;
          id: number;
          name: string;
          updated_at: string;
          user_id: string;
          transactions_count: number | null;
          transactions_sum: number | null;
        };
        Insert: {
          aliases: string[];
          color: string;
          created_at?: string;
          id?: number;
          name: string;
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          aliases?: string[];
          color?: string;
          created_at?: string;
          id?: number;
          name?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_categories_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      transactions: {
        Row: {
          amount: number;
          category_id: number;
          created_at: string;
          description: string;
          id: number;
          timestamp: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          category_id: number;
          created_at?: string;
          description: string;
          id?: number;
          timestamp: string;
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          amount?: number;
          category_id?: number;
          created_at?: string;
          description?: string;
          id?: number;
          timestamp?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_transactions_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_transactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      gbt_bit_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_bool_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_bool_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_bpchar_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_bytea_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_cash_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_cash_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_date_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_date_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_decompress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_enum_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_enum_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_float4_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_float4_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_float8_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_float8_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_inet_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_int2_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_int2_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_int4_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_int4_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_int8_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_int8_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_intv_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_intv_decompress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_intv_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_macad_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_macad_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_macad8_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_macad8_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_numeric_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_oid_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_oid_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_text_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_time_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_time_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_timetz_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_ts_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_ts_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_tstz_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_uuid_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_uuid_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_var_decompress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_var_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbtreekey_var_in: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbtreekey_var_out: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbtreekey16_in: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbtreekey16_out: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbtreekey2_in: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbtreekey2_out: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbtreekey32_in: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbtreekey32_out: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbtreekey4_in: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbtreekey4_out: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbtreekey8_in: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbtreekey8_out: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      transactions_count: {
        Args: {
          "": unknown;
        };
        Returns: number;
      };
      transactions_sum: {
        Args: {
          "": unknown;
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
