<script lang="ts" module>
	export type PasswordFieldProps<Form extends Record<string, unknown>> = InputFieldProps<Form>;
</script>

<script lang="ts" generics="Form extends Record<string, unknown>">
	import InputField, { type InputFieldProps } from './InputField.svelte';

	let passwordFieldType = $state<'password' | 'text'>('password');

	let props: PasswordFieldProps<Form> = $props();
</script>

<InputField
	label="Password"
	placeholder="********"
	field={'password' as any}
	type={passwordFieldType}
	{...props as any}
>
	{#snippet decoration()}
		<button
			class="button--text"
			type="button"
			style="height:auto"
			onclick={() => (passwordFieldType = passwordFieldType === 'password' ? 'text' : 'password')}
		>
			<small>
				{#if passwordFieldType === 'password'}Show{:else}Hide{/if}
			</small>
		</button>
	{/snippet}
</InputField>
