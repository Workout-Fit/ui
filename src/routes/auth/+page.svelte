<script lang="ts" module>
	export const signUpFormSchema = profileFormSchema.merge(authFormSchema);
</script>

<script lang="ts">
	import AuthForm, { authFormSchema } from '$lib/forms/AuthForm.svelte';
	import ProfileForm, { profileFormSchema } from '$lib/forms/ProfileForm.svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { PageServerData } from './$types';
	import type { z } from 'zod';
	import { fly } from 'svelte/transition';

	const { data }: { data: PageServerData } = $props();

	let mode: 'signup' | 'signin' = $state('signin');
</script>

<div class="auth">
	<h1>Welcome to Workout</h1>
	{#key mode}
		<div in:fly={{ x: 50, duration: 300 }}>
			{#if mode === 'signup'}
				<AuthForm
					action="?/signup"
					submitLabel="Sign-up"
					data={data.signUpForm}
					schema={signUpFormSchema}
					enctype="multipart/form-data"
				>
					{#snippet extraFields(form)}
						<ProfileForm form={form as unknown as SuperForm<z.infer<typeof profileFormSchema>>} />
					{/snippet}
				</AuthForm>
			{:else}
				<AuthForm action="?/signin" submitLabel="Sign-in" data={data.signInForm} />
			{/if}
		</div>
	{/key}
	<small>
		{mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
		<button
			style="display: inline;"
			class="button--text"
			onclick={() => (mode = mode === 'signup' ? 'signin' : 'signup')}
		>
			{mode === 'signup' ? 'Log-in' : 'Sign-up'}
		</button>
	</small>
</div>

<style>
	.auth {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: calc(2 * var(--base-spacing));
	}
</style>
