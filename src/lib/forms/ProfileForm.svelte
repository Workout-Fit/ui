<script lang="ts" module>
	import { z } from 'zod';
	import emptyProfilePicture from '$lib/assets/img/empty_ppic.webp';
	import * as m from '$lib/paraglide/messages';

	export const profileFormSchema = z.object({
		username: z.string().nonempty(),
		full_name: z.string().nonempty().max(50),
		weight: z.number().nullable(),
		height: z.number().int().nullable(),
		avatar: z.instanceof(File, { message: 'Please upload a file.' }).optional(),
		bio: z.string().nullable()
	});
</script>

<script lang="ts">
	import TextField from '$lib/components/TextField.svelte';
	import { fileProxy, type SuperForm } from 'sveltekit-superforms/client';

	const { form: formData }: { form: SuperForm<z.infer<typeof profileFormSchema>> } = $props();

	const { form, errors } = formData;

	const avatar = fileProxy(form, 'avatar');
</script>

<div class="profile-fields">
	<div class="profile-fields__avatar">
		<label for="avatar"><small>{m.avatar()}</small></label>
		<div>
			<img src={$form.avatar ? URL.createObjectURL($form.avatar) : emptyProfilePicture} alt="" />
			<input
				name="avatar"
				id="avatar"
				type="file"
				accept="image/jpeg,image/jpg,image/png,image/webp"
				bind:files={$avatar}
			/>
			<span>{$errors.avatar}</span>
		</div>
	</div>
	<TextField
		label={m.name()}
		autocomplete="name"
		placeholder="John Doe"
		field="full_name"
		form={formData}
	/>
	<TextField
		label={m.username()}
		autocomplete="username"
		placeholder="johndoe"
		field="username"
		form={formData}
	/>
	<div style="display: flex; gap: var(--base-spacing); width: 100%;">
		<TextField
			label={m.weight()}
			placeholder="60.0"
			step="0.1"
			type="number"
			field="weight"
			form={formData}
		/>
		<TextField label={m.height()} placeholder="173" type="number" field="height" form={formData} />
	</div>
	<TextField label={m.bio()} placeholder="Brazilian, 30yr" field="bio" form={formData} />
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
		flex-direction: column;
		align-items: center;
		gap: var(--base-spacing);
	}
</style>
