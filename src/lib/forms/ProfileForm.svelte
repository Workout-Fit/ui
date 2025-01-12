<script lang="ts" module>
	import { z } from 'zod';
	import emptyProfilePicture from '$lib/assets/img/empty_ppic.webp';

	export const profileFormSchema = z.object({
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
	import TextField from '$lib/components/TextField.svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';

	let { form: formData }: { form: SuperForm<z.infer<typeof profileFormSchema>> } = $props();

	let { form, errors } = formData;
	let avatarPreview: HTMLImageElement;

	$effect(() => {
		if ($form.avatar) {
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				avatarPreview.src = reader.result as string;
			});

			reader.readAsDataURL(($form.avatar as FileList)[0]);
		}
	});
</script>

<div class="profile-fields">
	<div class="profile-fields__avatar">
		<label for="avatar"><small>Avatar</small></label>
		<div>
			<img bind:this={avatarPreview} src={$form.avatarUrl ?? emptyProfilePicture} alt="" />
			<input
				name="avatar"
				id="avatar"
				type="file"
				accept="image/jpeg,image/jpg,image/png,image/webp"
				bind:files={$form.avatar as FileList}
			/>
			<span>{$errors.avatar}</span>
		</div>
	</div>
	<TextField
		label="Full Name"
		autocomplete="name"
		placeholder="John Doe"
		field="full_name"
		form={formData}
	/>
	<TextField
		label="Username"
		autocomplete="username"
		placeholder="johndoe"
		field="username"
		form={formData}
	/>
	<div style="display: flex; gap: var(--base-spacing); width: 100%;">
		<TextField
			label="Weight"
			placeholder="60.0"
			step="0.1"
			type="number"
			field="weight"
			form={formData}
		/>
		<TextField label="Height" placeholder="173" type="number" field="height" form={formData} />
	</div>
	<TextField label="Bio" placeholder="Brazilian, 30yr" field="bio" form={formData} />
</div>

<style>
	.profile-fields {
		display: flex;
		flex-direction: column;
		gap: var(--base-spacing);
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
