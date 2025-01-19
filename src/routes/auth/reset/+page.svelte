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
	import * as m from '$lib/paraglide/messages';
	import { i18n } from '$lib/i18n';

	const { data }: { data: PageServerData } = $props();

	const form = superForm(data.form, {
		validators: zodClient(resetFormSchema),
		onResult: ({ result }) => {
			if (result.type === 'error') showToast('error', { text: result.error.message });
			else if (result.type === 'redirect') {
				showToast('success', { text: 'Successfully reset your password' });
				goto(result.location, { invalidateAll: true });
			}
		}
	});

	const { enhance, submitting, delayed } = form;
</script>

<form method="POST" class="forgot-password" use:enhance>
	<h1>{m.reset_password()}</h1>
	<small>
		{m.reset_password_message({ email: page.url.searchParams.get('email') ?? '' })}
	</small>
	<PasswordField
		label={m.password()}
		placeholder="********"
		autocomplete="new-password"
		field={'password' as any}
		{form}
	/>
	<Button disabled={$submitting} loading={$delayed}>{m.reset_password()}</Button>
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
