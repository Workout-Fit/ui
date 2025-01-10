<script lang="ts">
	import FormActions from '$lib/components/FormActions.svelte';
	import ProfileForm, { profileFormSchema } from '$lib/forms/ProfileForm.svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { PageServerData } from './$types';
	import { zodClient } from 'sveltekit-superforms/adapters';

	const { data }: { data: PageServerData } = $props();

	const form = superForm(data.form, {
		validators: zodClient(profileFormSchema)
	});

	const { enhance, submitting, delayed } = form;
</script>

<form method="POST" use:enhance>
	<ProfileForm {form} />
	<FormActions disabled={$submitting} loading={$delayed} oncancel={() => history.back()} />
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		align-items: end;
		gap: calc(3 * var(--base-spacing));
	}
</style>
