export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			difficulties: {
				Row: {
					id: number;
					name: string;
				};
				Insert: {
					id?: number;
					name: string;
				};
				Update: {
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			equipments: {
				Row: {
					id: number;
					name: string;
				};
				Insert: {
					id?: number;
					name: string;
				};
				Update: {
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			exercise_types: {
				Row: {
					id: number;
					name: string;
				};
				Insert: {
					id?: number;
					name: string;
				};
				Update: {
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			exercises: {
				Row: {
					difficulty_id: number;
					equipment_id: number;
					exercise_type_id: number;
					id: string;
					muscle_group_id: number;
				};
				Insert: {
					difficulty_id: number;
					equipment_id: number;
					exercise_type_id: number;
					id?: string;
					muscle_group_id: number;
				};
				Update: {
					difficulty_id?: number;
					equipment_id?: number;
					exercise_type_id?: number;
					id?: string;
					muscle_group_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'exercise_difficulty_id_fkey';
						columns: ['difficulty_id'];
						isOneToOne: false;
						referencedRelation: 'difficulties';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'exercise_equipment_id_fkey';
						columns: ['equipment_id'];
						isOneToOne: false;
						referencedRelation: 'equipments';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'exercise_exercise_type_id_fkey';
						columns: ['exercise_type_id'];
						isOneToOne: false;
						referencedRelation: 'exercise_types';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'exercise_muscle_group_id_fkey';
						columns: ['muscle_group_id'];
						isOneToOne: false;
						referencedRelation: 'muscle_groups';
						referencedColumns: ['id'];
					}
				];
			};
			exercises_i18n: {
				Row: {
					exercise_id: string;
					language: string;
					name: string;
				};
				Insert: {
					exercise_id: string;
					language: string;
					name: string;
				};
				Update: {
					exercise_id?: string;
					language?: string;
					name?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'exercises_i18n_exercise_id_fkey';
						columns: ['exercise_id'];
						isOneToOne: false;
						referencedRelation: 'exercises';
						referencedColumns: ['id'];
					}
				];
			};
			muscle_groups: {
				Row: {
					id: number;
					name: string;
				};
				Insert: {
					id?: number;
					name: string;
				};
				Update: {
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			profiles: {
				Row: {
					bio: string | null;
					birthdate: string | null;
					created_at: string;
					full_name: string;
					height: number | null;
					user_id: string;
					username: string;
					weight: number | null;
					workouts: Database['public']['Tables']['workouts']['Row'] | null;
				};
				Insert: {
					bio?: string | null;
					birthdate?: string | null;
					created_at?: string;
					full_name?: string;
					height?: number | null;
					user_id: string;
					username: string;
					weight?: number | null;
				};
				Update: {
					bio?: string | null;
					birthdate?: string | null;
					created_at?: string;
					full_name?: string;
					height?: number | null;
					user_id?: string;
					username?: string;
					weight?: number | null;
				};
				Relationships: [];
			};
			workouts: {
				Row: {
					based_on: string | null;
					creation_date: string;
					id: string;
					name: string;
					notes: string | null;
					user_id: string;
					profile: Database['public']['Tables']['profiles']['Row'] | null;
				};
				Insert: {
					based_on?: string | null;
					creation_date?: string;
					id?: string;
					name: string;
					notes?: string | null;
					user_id?: string;
				};
				Update: {
					based_on?: string | null;
					creation_date?: string;
					id?: string;
					name?: string;
					notes?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'workouts_based_on_fkey';
						columns: ['based_on'];
						isOneToOne: false;
						referencedRelation: 'workouts';
						referencedColumns: ['id'];
					}
				];
			};
			workouts_exercises: {
				Row: {
					exercise_id: string;
					id: number;
					notes: string | null;
					repetitions: number[];
					rests: number[] | null;
					sets: number[];
					workout_id: string;
				};
				Insert: {
					exercise_id: string;
					id?: number;
					notes?: string | null;
					repetitions: number[];
					rests?: number[] | null;
					sets: number[];
					workout_id: string;
				};
				Update: {
					exercise_id?: string;
					id?: number;
					notes?: string | null;
					repetitions?: number[];
					rests?: number[] | null;
					sets?: number[];
					workout_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'workouts_exercises_exercise_id_fkey';
						columns: ['exercise_id'];
						isOneToOne: false;
						referencedRelation: 'exercises';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'workouts_exercises_workout_id_fkey';
						columns: ['workout_id'];
						isOneToOne: false;
						referencedRelation: 'workouts';
						referencedColumns: ['id'];
					}
				];
			};
			workouts_likes: {
				Row: {
					user_id: string;
					workout_id: string;
				};
				Insert: {
					user_id: string;
					workout_id: string;
				};
				Update: {
					user_id?: string;
					workout_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'workouts_likes_workout_id_fkey';
						columns: ['workout_id'];
						isOneToOne: false;
						referencedRelation: 'workouts';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			vw_profiles: {
				Row: {
					bio: string | null;
					birthdate: string | null;
					created_at: string | null;
					full_name: string | null;
					height: number | null;
					user_id: string | null;
					username: string | null;
					weight: number | null;
				};
				Relationships: [];
			};
		};
		Functions: {
			clone_workout: {
				Args: { target_user_id: string; source_workout_id: string };
				Returns: string;
			};
			profile: {
				Args: { '': Database['public']['Tables']['workouts']['Row'] };
				Returns: {
					bio: string | null;
					birthdate: string | null;
					created_at: string;
					full_name: string;
					height: number | null;
					user_id: string;
					username: string;
					weight: number | null;
				}[];
			};
			update_workouts_exercises: {
				Args:
					| {
							exercises: Database['public']['Tables']['workouts_exercises']['Row'][];
					  }
					| {
							exercises: Database['public']['Tables']['workouts_exercises']['Row'][];
							target_workout_id: string;
					  };
				Returns: undefined;
			};
			workouts: {
				Args: { '': Database['public']['Tables']['profiles']['Row'] };
				Returns: {
					based_on: string | null;
					creation_date: string;
					id: string;
					name: string;
					notes: string | null;
					user_id: string;
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

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
				Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
			Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof Database },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
		: never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
		? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema['CompositeTypes']
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
		? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	public: {
		Enums: {}
	}
} as const;
