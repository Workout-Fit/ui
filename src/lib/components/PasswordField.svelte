<script lang="ts" module>
	export type PasswordFieldProps<Form extends Record<string, unknown>> = TextFieldProps<Form>;
</script>

<script lang="ts" generics="Form extends Record<string, unknown>">
	import Button from './Button.svelte';

	import TextField, { type TextFieldProps } from './TextField.svelte';

	let passwordFieldType = $state<'password' | 'text'>('password');

	let props: PasswordFieldProps<Form> = $props();
</script>

<TextField
	label="Password"
	placeholder="********"
	field={'password' as any}
	type={passwordFieldType}
	{...props as any}
>
	{#snippet decoration()}
		<Button
			variant="text"
			type="button"
			style="height:auto"
			onclick={() => (passwordFieldType = passwordFieldType === 'password' ? 'text' : 'password')}
		>
			<small>
				{#if passwordFieldType === 'password'}Show{:else}Hide{/if}
			</small>
		</Button>
	{/snippet}
</TextField>
