<script lang="ts" module>
	import { z } from 'zod';

	export const schema = z.object({
		full_name: z.string().nonempty().max(50),
		username: z.string().nonempty(),
		weight: z.number().nullable(),
		height: z.number().int().nullable(),
		avatarUrl: z.string().nullable(),
		avatar: z.custom<FileList | File>().refine((file) => {
			if (!file) return true;
			if (file instanceof File) return file.type.startsWith('image/');
			return file[0].type.startsWith('image/');
		}, 'Please upload an image file.'),
		bio: z.string().nullable()
	});
</script>

<script lang="ts">
	import InputField from '$lib/components/InputField.svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';

	let { form: formData }: { form: SuperForm<z.infer<typeof schema>> } = $props();

	let { form, constraints, errors } = formData;
	let avatarPreview: HTMLImageElement;

	$effect(() => {
		if ($form.avatar) {
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				avatarPreview.src = reader.result as string;
			});

			reader.readAsDataURL($form.avatar[0]);
		}
	});
</script>

<div class="profile-fields">
	<div class="profile-fields__avatar">
		<label for="avatar">Avatar</label>
		<div>
			<img bind:this={avatarPreview} src={$form.avatarUrl} alt="" />
			<input
				name="avatar"
				type="file"
				accept="image/jpeg,image/jpg,image/png,image/webp"
				bind:files={$form.avatar}
			/>
			<span>{$errors.avatar}</span>
		</div>
	</div>
	<InputField
		label="Full Name"
		name="full_name"
		bind:value={$form.full_name}
		errors={$errors.full_name}
		constraints={$constraints.full_name}
	/>
	<InputField
		label="Username"
		name="username"
		bind:value={$form.username}
		errors={$errors.username}
		constraints={$constraints.username}
	/>
	<div style="display: flex; gap: var(--base-spacing); width: 100%;">
		<InputField
			label="Weight"
			type="number"
			name="weight"
			bind:value={$form.weight}
			errors={$errors.weight}
			constraints={$constraints.weight}
		/>
		<InputField
			label="Height"
			type="number"
			name="height"
			bind:value={$form.height}
			errors={$errors.height}
			constraints={$constraints.height}
		/>
	</div>
	<InputField
		label="Bio"
		name="bio"
		multiline
		bind:value={$form.bio}
		errors={$errors.bio}
		constraints={$constraints.bio}
	/>
</div>

<style>
	.profile-fields {
		display: flex;
		flex-direction: column;
		gap: calc(2 * var(--base-spacing));
		width: 100%;
	}

	.profile-fields__avatar {
		display: flex;
		flex-direction: column;
		gap: var(--base-spacing);
	}

	.profile-fields__avatar img {
		width: 75px;
		height: 75px;
		object-fit: cover;
		border-radius: 50%;
	}

	.profile-fields__avatar > div {
		display: flex;
		align-items: center;
		gap: var(--base-spacing);
	}
</style>
