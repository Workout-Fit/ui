<script lang="ts" module>
	export const resetFormSchema = signUpFormSchema.pick({ password: true });
</script>

<script lang="ts">
	import { page } from '$app/state';
	import PasswordField from '$lib/components/PasswordField.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { signUpFormSchema } from '../+page.svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageServerData } from './$types';
	import { showToast } from '$lib/utils/toast';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';

	const { data }: { data: PageServerData } = $props();

	const form = superForm(data.form, {
		validators: zodClient(resetFormSchema),
		onError: ({ result }) => showToast('error', { text: result.error.message }),
		onUpdated: ({ form }) => {
			showToast('success', { text: form.message });
			goto('/');
		}
	});

	const { enhance, submitting, delayed } = form;
</script>

<form method="POST" class="forgot-password" use:enhance>
	<h1>Reset your password</h1>
	<small>
		You are resetting the password for <b>{page.url.searchParams.get('email') ?? ''}</b>
	</small>
	<PasswordField
		label="Password"
		placeholder="********"
		autocomplete="new-password"
		field={'password' as any}
		{form}
	/>
	<Button disabled={$submitting} loading={$delayed}>Reset your password</Button>
</form>

<style>
	.forgot-password {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: calc(2 * var(--base-spacing));
		max-width: 350px;
		margin: auto;
	}
</style>
