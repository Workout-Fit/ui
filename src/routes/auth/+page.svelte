<script lang="ts" module>
	export const signUpFormSchema = z.object({
		...profileFormSchema.shape,
		...authFormSchema.shape,
		password: z.string().min(8).max(50)
	});
</script>

<script lang="ts">
	import AuthForm, { authFormSchema } from '$lib/forms/AuthForm.svelte';
	import ProfileForm, { profileFormSchema } from '$lib/forms/ProfileForm.svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { PageServerData } from './$types';
	import { z } from 'zod';
	import { fly } from 'svelte/transition';
	import Logo from '$lib/components/Logo.svelte';
	import { page } from '$app/state';
	import { showToast } from '$lib/utils/toast';

	const { data }: { data: PageServerData } = $props();

	let mode: 'signup' | 'signin' = $state('signin');
</script>

<div class="auth">
	<Logo width={100} />

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
				<AuthForm action="?/signin" submitLabel="Sign-in" data={data.signInForm}>
					{#snippet extraFields(form)}
						<button formaction="?/forgot" class="button--text forgot-password">
							Forgot your password?
						</button>
					{/snippet}
				</AuthForm>
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
		max-width: 350px;
		margin: auto;
	}

	.forgot-password {
		display: inline;
		padding: 0;
		text-align: left;
		font-size: 0.5rem;
		height: auto;
		margin-bottom: calc(2 * var(--base-spacing));
	}
</style>
