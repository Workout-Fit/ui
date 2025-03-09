<script lang="ts">
	import * as Button from '$lib/components/button';

	let { ref = $bindable(null), ...restProps }: Button.Props = $props();
</script>

<Button.Root type="submit" bind:ref {...restProps} />
