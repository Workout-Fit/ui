<script lang="ts">
	import clsx from 'clsx';

	let { class: className = '' } = $props();
</script>

<svg
	width="24"
	height="24"
	class={clsx('circular-progress', className)}
	viewBox="0 0 24 24"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<g class="circular-progress">
		<circle cx="12" cy="12" r="9.5" stroke-width="3"></circle>
	</g>
</svg>

<style>
	.circular-progress {
		transform-origin: center;
		animation: outer-animation 2s linear infinite;
	}
	.circular-progress circle {
		stroke-linecap: round;
		animation: inner-animation 1.5s ease-in-out infinite;
	}
	@keyframes outer-animation {
		100% {
			transform: rotate(360deg);
		}
	}
	@keyframes inner-animation {
		0% {
			stroke-dasharray: 0 150;
			stroke-dashoffset: 0;
		}
		47.5% {
			stroke-dasharray: 42 150;
			stroke-dashoffset: -16;
		}
		95%,
		100% {
			stroke-dasharray: 42 150;
			stroke-dashoffset: -59;
		}
	}
</style>
