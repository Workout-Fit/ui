<script lang="ts">
	import { FormActions } from '$lib/components/form-actions';
	import ProfileForm, { profileFormSchema } from '$lib/forms/ProfileForm.svelte';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as m from '$lib/paraglide/messages';
	import type { z } from 'zod';

	const { data }: { data: PageData } = $props();

	const form = superForm(data.form as SuperValidated<z.infer<typeof profileFormSchema>>, {
		validators: zodClient(profileFormSchema)
	});

	const { enhance, submitting } = form;
</script>

<form
	method="POST"
	class="item-end m-auto flex flex-col gap-5"
	use:enhance
	enctype="multipart/form-data"
>
	<h2 class="text-2xl font-bold">{m.update_profile()}</h2>
	<ProfileForm {form} />
	<FormActions
		class="ml-auto"
		disabled={$submitting}
		loading={$submitting}
		oncancel={() => history.back()}
	/>
</form>
