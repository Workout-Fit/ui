<script lang="ts" module>
	export const resetFormSchema = signUpFormSchema.pick({ password: true });
</script>

<script lang="ts">
	import { page } from '$app/state';
	import { superForm } from 'sveltekit-superforms';
	import { signUpFormSchema } from '../+page.svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageServerData } from './$types';
	import { Button } from '$lib/components/button';
	import * as m from '$lib/paraglide/messages';
	import { FormInput } from '$lib/components/form-input';

	const { data }: { data: PageServerData } = $props();

	const form = superForm(data.form, {
		validators: zodClient(resetFormSchema)
	});

	const { enhance, submitting, delayed } = form;
</script>

<form method="POST" class="m-auto flex max-w-96 flex-col items-center gap-4" use:enhance>
	<h1 class="text-4xl font-bold">{m.reset_password()}</h1>
	<small>
		{m.reset_password_message({ email: page.url.searchParams.get('email') ?? '' })}
	</small>
	<FormInput
		label={m.password()}
		placeholder="********"
		autocomplete="new-password"
		type="password"
		field={'password' as any}
		{form}
	/>
	<Button disabled={$submitting} type="submit" loading={$delayed}>{m.reset_password()}</Button>
</form>
