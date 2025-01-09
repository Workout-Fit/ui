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
	import type { SignInWithIdTokenCredentials } from '@supabase/supabase-js';
	import { onDestroy, onMount } from 'svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { showToast } from '$lib/utils/toast';
	import type { CredentialResponse } from 'google-one-tap';

	const { data }: { data: PageServerData } = $props();

	let mode: 'signup' | 'signin' = $state('signin');

	const handleSignInWithProvider = async (credentials: SignInWithIdTokenCredentials) => {
		const response = await fetch('/auth/sso', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ...credentials, nonce: data.nonce })
		});

		if (response.ok) {
			const { redirect } = await response.json();
			goto(redirect);
		} else {
			const { message } = await response.json();
			showToast('error', { text: message });
		}
	};

	const handleSignInWithGoogle = ({ credential }: CredentialResponse) => {
		handleSignInWithProvider({ provider: 'google', token: credential });
	};

	let googleSSOButton: HTMLDivElement;

	onMount(() => {
		google.accounts.id.initialize({
			client_id: '38946104540-ds46as4ipuuhe2a57i5t34gmp60baolg.apps.googleusercontent.com',
			context: 'signin',
			ux_mode: 'popup',
			callback: handleSignInWithGoogle,
			nonce: data.hashedNonce,
			auto_select: true,
			itp_support: true,
			use_fedcm_for_prompt: true
		});

		google.accounts.id.prompt();
		google.accounts.id.renderButton(googleSSOButton, {
			type: 'standard',
			shape: 'rectangular',
			theme: 'outline',
			text: 'continue_with',
			size: 'large',
			logo_alignment: 'left'
		});
	});
</script>

<svelte:head>
	<meta name="referrer" content="origin" />
	<script src="https://accounts.google.com/gsi/client" async></script>
</svelte:head>

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
					{#snippet extraFields()}
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
	<div bind:this={googleSSOButton}></div>
</div>

<style>
	.auth {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--base-spacing);
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
