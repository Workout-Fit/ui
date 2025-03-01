<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className = '' } = $props();
</script>

<svg
	width="24"
	height="24"
	viewBox="0 0 24 24"
	class={cn('fill-white', className)}
	role="progressbar"
	xmlns="http://www.w3.org/2000/svg"
>
	<circle class="animate-bounce" cx="4" cy="12" r="3" />
	<circle class="animate-bounce delay-100" cx="12" cy="12" r="3" />
	<circle class="animate-bounce delay-200" cx="20" cy="12" r="3" />
</svg>
