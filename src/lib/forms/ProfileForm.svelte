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
	import { FormInput } from '$lib/components/form-input';
	import { type SuperForm } from 'sveltekit-superforms/client';
	import { Avatar, AvatarImage } from '$lib/components/avatar';
	import { FormFileInput } from '$lib/components/form-input';

	const { form: formData }: { form: SuperForm<z.infer<typeof profileFormSchema>> } = $props();

	const { form } = formData;
</script>

<div class="flex flex-col items-stretch gap-2">
	<div>
		<FormFileInput
			field="avatar"
			form={formData as any}
			label={m.avatar()}
			accept="image/jpeg,image/jpg,image/png,image/webp"
		>
			<Avatar>
				<AvatarImage
					src={$form.avatar ? URL.createObjectURL($form.avatar) : emptyProfilePicture}
					alt=""
				/>
			</Avatar>
		</FormFileInput>
	</div>
	<FormInput
		label={m.name()}
		autocomplete="name"
		placeholder="John Doe"
		field="full_name"
		form={formData}
	/>
	<FormInput
		label={m.username()}
		autocomplete="username"
		placeholder="johndoe"
		field="username"
		form={formData}
	/>
	<div class="flex w-full gap-2">
		<FormInput
			label={m.weight()}
			placeholder="60.0"
			step="0.1"
			type="number"
			field="weight"
			form={formData}
		/>
		<FormInput label={m.height()} placeholder="173" type="number" field="height" form={formData} />
	</div>
	<FormInput label={m.bio()} placeholder="Brazilian, 30yr" field="bio" form={formData} />
</div>
