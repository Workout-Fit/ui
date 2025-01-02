<script lang="ts" module>
	export const signUpFormSchema = profileFormSchema.merge(authFormSchema);
</script>

<script lang="ts">
	import { page } from '$app/state';
	import AuthForm, { authFormSchema } from '$lib/forms/AuthForm.svelte';
	import ProfileForm, { profileFormSchema } from '$lib/forms/ProfileForm.svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { PageServerData } from './$types';
	import type { z } from 'zod';

	const { data }: { data: PageServerData } = $props();

	let mode: 'signup' | 'signin' = $state('signup');

	$effect(() => {
		if (page.url.searchParams.get('mode'))
			mode = page.url.searchParams.get('mode') as 'signup' | 'signin';
	});
</script>

<div class="auth">
	<h1>Welcome to Workout</h1>
	<AuthForm
		action={mode === 'signup' ? '?/signup' : '?/signin'}
		submitLabel={mode === 'signup' ? 'Sign-up' : 'signin'}
		form={data.signUpForm}
		schema={mode === 'signup' ? signUpFormSchema : authFormSchema}
		enctype="multipart/form-data"
	>
		{#snippet extraFields(form)}
			{#if mode === 'signup'}
				<ProfileForm form={form as unknown as SuperForm<z.infer<typeof profileFormSchema>>} />
			{/if}
		{/snippet}
	</AuthForm>

	<small>
		{mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
		<a href={mode === 'signup' ? '?mode=signin' : '?mode=signup'}>
			{mode === 'signup' ? 'Log-in' : 'Sign-up'}
		</a>
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
