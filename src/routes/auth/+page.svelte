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
	import { Logo } from '$lib/components/logo';
	import type { SignInWithIdTokenCredentials } from '@supabase/supabase-js';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import type { CredentialResponse } from 'google-one-tap';
	import { Button } from '$lib/components/button';
	import * as m from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import { i18n } from '$lib/i18n';

	const { data }: { data: PageServerData } = $props();

	let mode: 'signup' | 'signin' = $state('signin');
	let ssoSignIn = $state(false);

	const redirectToPreviousURL = () =>
		goto(i18n.resolveRoute(page.url.searchParams.get('redirect_uri') ?? '/'), {
			invalidateAll: true
		});

	const handleSignInWithProvider = async (credentials: SignInWithIdTokenCredentials) => {
		ssoSignIn = true;
		const response = await fetch('/api/auth/sso', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ...credentials, nonce: data.nonce })
		});
		if (response.ok) redirectToPreviousURL();
		else {
			const { message } = await response.json();
			toast.error(message);
		}
		ssoSignIn = false;
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
</script>

<svelte:head>
	<meta name="referrer" content="no-referrer-when-downgrade" />
	<script src="https://accounts.google.com/gsi/client" async onload={initializeGoogleSSO}></script>
</svelte:head>

<div class="m-auto flex min-w-[250px] flex-col items-center gap-2">
	<Logo width={150} />
	{#key mode}
		<div class="w-full" in:fly={{ x: 50, duration: 300 }}>
			{#if mode === 'signup'}
				<AuthForm
					action="?/signup"
					submitLabel={m.sign_up()}
					data={data.signUpForm}
					schema={signUpFormSchema}
					passwordHTMLAutocomplete="new-password"
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
				/>
				<Button variant="ghost" form="sign-in" formaction="?/forgot" class="ml-auto mt-2 flex">
					{m.forgot_password()}
				</Button>
			{/if}
		</div>
	{/key}
	<hr class="w-full" />
	<div bind:this={googleSSOButton}></div>
	<small>
		{mode === 'signup' ? m.sign_in_label() : m.sign_up_label()}
		<Button
			variant="ghost"
			disabled={ssoSignIn}
			onclick={() => (mode = mode === 'signup' ? 'signin' : 'signup')}
		>
			{mode === 'signup' ? m.sign_in() : m.sign_up()}
		</Button>
	</small>
</div>
