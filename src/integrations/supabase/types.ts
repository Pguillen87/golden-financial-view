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
      chat_messages: {
        Row: {
          active: boolean | null
          bot_message: string | null
          conversation_id: string | null
          created_at: string | null
          id: number
          message_type: string | null
          phone: string | null
          user_message: string | null
        }
        Insert: {
          active?: boolean | null
          bot_message?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: number
          message_type?: string | null
          phone?: string | null
          user_message?: string | null
        }
        Update: {
          active?: boolean | null
          bot_message?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: number
          message_type?: string | null
          phone?: string | null
          user_message?: string | null
        }
        Relationships: []
      }
      chats: {
        Row: {
          app: string | null
          conversation_id: string | null
          created_at: string | null
          id: number
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          app?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: number
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          app?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: number
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      dados_cliente: {
        Row: {
          created_at: string | null
          id: number
          sessionid: string | null
          telefone: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          sessionid?: string | null
          telefone?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          sessionid?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      financeiro_bancos: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          cliente_id: string
          criado_em: string | null
          descricao: string | null
          id: number
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          cliente_id: string
          criado_em?: string | null
          descricao?: string | null
          id?: number
          nome: string
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          cliente_id?: string
          criado_em?: string | null
          descricao?: string | null
          id?: number
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_bancos_cliente"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "financeiro_clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      financeiro_categorias_entrada: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          cliente_id: string
          cor: string | null
          criado_em: string | null
          descricao: string | null
          icone: string | null
          id: number
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          cliente_id: string
          cor?: string | null
          criado_em?: string | null
          descricao?: string | null
          icone?: string | null
          id?: number
          nome: string
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          cliente_id?: string
          cor?: string | null
          criado_em?: string | null
          descricao?: string | null
          icone?: string | null
          id?: number
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_cat_entrada_cliente"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "financeiro_clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      financeiro_categorias_saida: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          cliente_id: string
          cor: string | null
          criado_em: string | null
          descricao: string | null
          icone: string | null
          id: number
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          cliente_id: string
          cor?: string | null
          criado_em?: string | null
          descricao?: string | null
          icone?: string | null
          id?: number
          nome: string
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          cliente_id?: string
          cor?: string | null
          criado_em?: string | null
          descricao?: string | null
          icone?: string | null
          id?: number
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_cat_saida_cliente"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "financeiro_clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      financeiro_clientes: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          auth_user_id: string
          canal: string | null
          criado_em: string | null
          email: string | null
          id: string
          identificador: string | null
          nome: string
          senha: string | null
          telefone: string | null
          token: string | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          auth_user_id: string
          canal?: string | null
          criado_em?: string | null
          email?: string | null
          id?: string
          identificador?: string | null
          nome: string
          senha?: string | null
          telefone?: string | null
          token?: string | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          auth_user_id?: string
          canal?: string | null
          criado_em?: string | null
          email?: string | null
          id?: string
          identificador?: string | null
          nome?: string
          senha?: string | null
          telefone?: string | null
          token?: string | null
        }
        Relationships: []
      }
      financeiro_entradas: {
        Row: {
          atualizado_em: string | null
          banco_id: number | null
          categoria_id: number
          cliente_id: string
          criado_em: string | null
          data: string
          data_recebimento: string | null
          descricao: string | null
          forma_pagamento_id: number | null
          id: number
          observacoes: string | null
          parcela_atual: number | null
          recebida: boolean | null
          status: string | null
          total_parcelas: number | null
          valor: number
        }
        Insert: {
          atualizado_em?: string | null
          banco_id?: number | null
          categoria_id: number
          cliente_id: string
          criado_em?: string | null
          data: string
          data_recebimento?: string | null
          descricao?: string | null
          forma_pagamento_id?: number | null
          id?: number
          observacoes?: string | null
          parcela_atual?: number | null
          recebida?: boolean | null
          status?: string | null
          total_parcelas?: number | null
          valor: number
        }
        Update: {
          atualizado_em?: string | null
          banco_id?: number | null
          categoria_id?: number
          cliente_id?: string
          criado_em?: string | null
          data?: string
          data_recebimento?: string | null
          descricao?: string | null
          forma_pagamento_id?: number | null
          id?: number
          observacoes?: string | null
          parcela_atual?: number | null
          recebida?: boolean | null
          status?: string | null
          total_parcelas?: number | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_entradas_banco"
            columns: ["banco_id"]
            isOneToOne: false
            referencedRelation: "financeiro_bancos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_entradas_categoria"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "financeiro_categorias_entrada"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_entradas_cliente"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "financeiro_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_entradas_forma_pgto"
            columns: ["forma_pagamento_id"]
            isOneToOne: false
            referencedRelation: "financeiro_formas_pagamento"
            referencedColumns: ["id"]
          },
        ]
      }
      financeiro_formas_pagamento: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          cliente_id: string
          criado_em: string | null
          id: number
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          cliente_id: string
          criado_em?: string | null
          id?: number
          nome: string
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          cliente_id?: string
          criado_em?: string | null
          id?: number
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_forma_pgto_cliente"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "financeiro_clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      financeiro_metas: {
        Row: {
          atualizado_em: string | null
          banco_id: number | null
          categoria_id: number
          cliente_id: string
          concluida: boolean | null
          criado_em: string | null
          descricao: string | null
          id: number
          nome: string
          periodo_fim: string
          periodo_inicio: string
          repetir: boolean | null
          tipo: string
          valor_alvo: number
          valor_atual: number | null
        }
        Insert: {
          atualizado_em?: string | null
          banco_id?: number | null
          categoria_id: number
          cliente_id: string
          concluida?: boolean | null
          criado_em?: string | null
          descricao?: string | null
          id?: number
          nome: string
          periodo_fim: string
          periodo_inicio: string
          repetir?: boolean | null
          tipo: string
          valor_alvo: number
          valor_atual?: number | null
        }
        Update: {
          atualizado_em?: string | null
          banco_id?: number | null
          categoria_id?: number
          cliente_id?: string
          concluida?: boolean | null
          criado_em?: string | null
          descricao?: string | null
          id?: number
          nome?: string
          periodo_fim?: string
          periodo_inicio?: string
          repetir?: boolean | null
          tipo?: string
          valor_alvo?: number
          valor_atual?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_metas_banco"
            columns: ["banco_id"]
            isOneToOne: false
            referencedRelation: "financeiro_bancos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_metas_cliente"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "financeiro_clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      financeiro_metas_categorias: {
        Row: {
          categoria_entrada_id: number | null
          categoria_saida_id: number | null
          cliente_id: string
          criado_em: string | null
          id: number
          meta_id: number
        }
        Insert: {
          categoria_entrada_id?: number | null
          categoria_saida_id?: number | null
          cliente_id: string
          criado_em?: string | null
          id?: number
          meta_id: number
        }
        Update: {
          categoria_entrada_id?: number | null
          categoria_saida_id?: number | null
          cliente_id?: string
          criado_em?: string | null
          id?: number
          meta_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_metas_cat_cliente"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "financeiro_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_metas_cat_entrada"
            columns: ["categoria_entrada_id"]
            isOneToOne: false
            referencedRelation: "financeiro_categorias_entrada"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_metas_cat_meta"
            columns: ["meta_id"]
            isOneToOne: false
            referencedRelation: "financeiro_metas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_metas_cat_saida"
            columns: ["categoria_saida_id"]
            isOneToOne: false
            referencedRelation: "financeiro_categorias_saida"
            referencedColumns: ["id"]
          },
        ]
      }
      financeiro_saidas: {
        Row: {
          atualizado_em: string | null
          banco_id: number | null
          categoria_id: number
          cliente_id: string
          criado_em: string | null
          data: string
          data_pagamento: string | null
          data_vencimento: string | null
          descricao: string | null
          forma_pagamento_id: number | null
          id: number
          observacoes: string | null
          paga: boolean | null
          parcela_atual: number | null
          status: string | null
          total_parcelas: number | null
          valor: number
        }
        Insert: {
          atualizado_em?: string | null
          banco_id?: number | null
          categoria_id: number
          cliente_id: string
          criado_em?: string | null
          data: string
          data_pagamento?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          forma_pagamento_id?: number | null
          id?: number
          observacoes?: string | null
          paga?: boolean | null
          parcela_atual?: number | null
          status?: string | null
          total_parcelas?: number | null
          valor: number
        }
        Update: {
          atualizado_em?: string | null
          banco_id?: number | null
          categoria_id?: number
          cliente_id?: string
          criado_em?: string | null
          data?: string
          data_pagamento?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          forma_pagamento_id?: number | null
          id?: number
          observacoes?: string | null
          paga?: boolean | null
          parcela_atual?: number | null
          status?: string | null
          total_parcelas?: number | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_saidas_banco"
            columns: ["banco_id"]
            isOneToOne: false
            referencedRelation: "financeiro_bancos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_saidas_categoria"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "financeiro_categorias_saida"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_saidas_cliente"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "financeiro_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_saidas_forma_pgto"
            columns: ["forma_pagamento_id"]
            isOneToOne: false
            referencedRelation: "financeiro_formas_pagamento"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          created_at: string | null
          current_amount: number
          deadline: string
          id: string
          name: string
          target_amount: number
        }
        Insert: {
          created_at?: string | null
          current_amount?: number
          deadline: string
          id?: string
          name: string
          target_amount: number
        }
        Update: {
          created_at?: string | null
          current_amount?: number
          deadline?: string
          id?: string
          name?: string
          target_amount?: number
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          date: string
          description: string
          id: string
          type: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          date: string
          description: string
          id?: string
          type: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_documents: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      match_livro_isa: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
