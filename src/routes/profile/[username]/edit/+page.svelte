<script lang="ts">
	import FormActions from '$lib/components/FormActions.svelte';
	import ProfileForm, { profileFormSchema } from '$lib/forms/ProfileForm.svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { PageServerData } from './$types';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showToast } from '$lib/utils/toast';
	import { goto } from '$app/navigation';

	const { data }: { data: PageServerData } = $props();

	const form = superForm(data.form, {
		validators: zodClient(profileFormSchema),
		onResult: ({ result }) => {
			if (result.type === 'error') showToast('error', { text: result.error.message });
			else if (result.type === 'redirect') {
				showToast('success', { text: 'Successfully edited your profile' });
				goto(result.location, { invalidateAll: true });
			}
		}
	});

	const { enhance, submitting } = form;
</script>

<form method="POST" use:enhance enctype="multipart/form-data">
	<ProfileForm {form} />
	<FormActions disabled={$submitting} loading={$submitting} oncancel={() => history.back()} />
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		align-items: end;
		gap: calc(3 * var(--base-spacing));
	}
</style>
