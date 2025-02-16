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
	import type { FormOptions, SuperForm } from 'sveltekit-superforms/client';
	import type { PageServerData } from './$types';
	import { z } from 'zod';
	import { fly } from 'svelte/transition';
	import Logo from '$lib/components/Logo.svelte';
	import type { SignInWithIdTokenCredentials } from '@supabase/supabase-js';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-french-toast';
	import type { CredentialResponse } from 'google-one-tap';
	import Button from '$lib/components/Button.svelte';
	import * as m from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import { i18n } from '$lib/i18n';

	const { data }: { data: PageServerData } = $props();

	let mode: 'signup' | 'signin' = $state('signin');
	let ssoSignIn = $state(false);

	const handleSignInWithProvider = async (credentials: SignInWithIdTokenCredentials) => {
		ssoSignIn = true;
		const response = await fetch('/api/auth/sso', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ...credentials, nonce: data.nonce })
		});

		if (response.ok)
			goto(page.url.searchParams.get('redirect_uri') ?? '/', { invalidateAll: true });
		else {
			const { message } = await response.json();
			toast.error(message);
		}
	};

	const handleSignInWithGoogle = ({ credential }: CredentialResponse) => {
		handleSignInWithProvider({ provider: 'google', token: credential });
	};

	let googleSSOButton: HTMLDivElement;

	const initializeGoogleSSO = () => {
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
	};

	const onAuthUpdate: FormOptions<z.infer<typeof authFormSchema>>['onUpdate'] = ({
		result,
		form
	}) => {
		const redirectUri = page.url.searchParams.get('redirect_uri') ?? '/';
		if (result.type === 'failure') return;
		if (form.message) toast.success(form.message);
		goto(i18n.resolveRoute(redirectUri), { invalidateAll: true });
	};
</script>

<svelte:head>
	<meta name="referrer" content="no-referrer-when-downgrade" />
	<script src="https://accounts.google.com/gsi/client" async onload={initializeGoogleSSO}></script>
</svelte:head>

<div class="auth">
	<Logo width={100} />
	{#key mode}
		<div style="width: 100%;" in:fly={{ x: 50, duration: 300 }}>
			{#if mode === 'signup'}
				<AuthForm
					action="?/signup"
					submitLabel={m.sign_up()}
					data={data.signUpForm}
					schema={signUpFormSchema}
					passwordHTMLAutocomplete="new-password"
					onUpdate={onAuthUpdate}
					enctype="multipart/form-data"
				>
					{#snippet extraFields(form)}
						<ProfileForm form={form as unknown as SuperForm<z.infer<typeof profileFormSchema>>} />
					{/snippet}
				</AuthForm>
			{:else}
				<AuthForm
					action="?/signin"
					id="sign-in"
					submitLabel={m.sign_in()}
					data={data.signInForm}
					disabled={ssoSignIn}
					onUpdate={onAuthUpdate as any}
				/>
				<Button variant="text" form="sign-in" formaction="?/forgot" class="forgot-password">
					{m.forgot_password()}
				</Button>
			{/if}
		</div>
	{/key}
	<hr style="width: 100%;" />
	<div bind:this={googleSSOButton}></div>
	<small>
		{mode === 'signup' ? m.sign_in_label() : m.sign_up_label()}
		<Button
			style="display: inline;"
			variant="text"
			disabled={ssoSignIn}
			onclick={() => (mode = mode === 'signup' ? 'signin' : 'signup')}
		>
			{mode === 'signup' ? m.sign_in() : m.sign_up()}
		</Button>
	</small>
</div>

<style>
	.auth {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--base-spacing);
		max-width: min(100%, 350px);
		margin: auto;
		padding: var(--base-spacing);
		box-sizing: content-box;
	}

	:global(button.forgot-password) {
		margin-top: var(--base-spacing);
		text-align: right;
		font-size: 0.6rem;
		height: auto;
		margin-left: auto;
	}

	hr {
		border: none;
		margin: calc(0.5 * var(--base-spacing)) 0;
		border-bottom: 1px dashed var(--text-medium);
	}

	:global(svg.logo:hover) {
		filter: none;
	}
</style>
