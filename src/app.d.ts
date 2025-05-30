import type { AvailableLanguageTag } from '../../lib/paraglide/runtime';
// See https://svelte.dev/docs/kit/types#app.d.ts
/// <reference types="vite-plugin-pwa/svelte" />

import type { Database } from '$lib/supabase/database.types';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import '@poppanator/sveltekit-svg/dist/svg';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
		}
		interface PageData {
			session: Session | null;
			flash?: Superforms.Message;
		}
		interface PageState {
			modalShown?: 'save-exercise' | 'confirm-delete-workout';
			exerciseIndex?: number;
		}
		// interface Platform {}
		namespace Superforms {
			type Message = {
				type: 'error' | 'success';
				text: string;
			};
		}
	}
}

export {};
