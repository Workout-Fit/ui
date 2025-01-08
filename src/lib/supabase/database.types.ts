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
					name: string;
				};
				Insert: {
					difficulty_id: number;
					equipment_id: number;
					exercise_type_id: number;
					id?: string;
					muscle_group_id: number;
					name: string;
				};
				Update: {
					difficulty_id?: number;
					equipment_id?: number;
					exercise_type_id?: number;
					id?: string;
					muscle_group_id?: number;
					name?: string;
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
					description: string | null;
					id: string;
					name: string;
					user_id: string;
				};
				Insert: {
					based_on?: string | null;
					creation_date?: string;
					description?: string | null;
					id?: string;
					name: string;
					user_id?: string;
				};
				Update: {
					based_on?: string | null;
					creation_date?: string;
					description?: string | null;
					id?: string;
					name?: string;
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
					notes: string | null;
					repetitions: number;
					rest: number;
					sets: number;
					workout_id: string;
				};
				Insert: {
					exercise_id: string;
					notes?: string | null;
					repetitions: number;
					rest: number;
					sets: number;
					workout_id: string;
				};
				Update: {
					exercise_id?: string;
					notes?: string | null;
					repetitions?: number;
					rest?: number;
					sets?: number;
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
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			clone_workout: {
				Args: {
					target_user_id: string;
					source_workout_id: string;
				};
				Returns: string;
			};
			update_workouts_exercises: {
				Args: {
					exercises: Database['public']['Tables']['workouts_exercises']['Row'][];
				};
				Returns: undefined;
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

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
		? PublicSchema['Enums'][PublicEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof PublicSchema['CompositeTypes']
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
		? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never;
