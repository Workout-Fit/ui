<script lang="ts" module>
	export const resetFormSchema = signUpFormSchema.pick({ password: true });
</script>

<script lang="ts">
	import { page } from '$app/state';
	import { superForm } from 'sveltekit-superforms';
	import { signUpFormSchema } from '../+page.svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageServerData } from './$types';
	import { toast } from 'svelte-french-toast';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as m from '$lib/paraglide/messages';
	import { FormInput } from '$lib/components/ui/form-input';

	const { data }: { data: PageServerData } = $props();

	const form = superForm(data.form, {
		validators: zodClient(resetFormSchema),
		onResult: ({ result }) => {
			if (result.type === 'error') toast.error(result.error.message);
			else if (result.type === 'redirect') {
				toast.success(m.password_reset_success());
				goto(result.location, { invalidateAll: true });
			}
		}
	});

	const { enhance, submitting, delayed } = form;
</script>

<form method="POST" class="m-auto flex max-w-96 flex-col items-center gap-4" use:enhance>
	<h1>{m.reset_password()}</h1>
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
	<Button disabled={$submitting} loading={$delayed}>{m.reset_password()}</Button>
</form>
