<script lang="ts">
	let { color = 'white' }: { color?: 'white' | 'black' | 'primary' } = $props();
</script>

<svg
	width="24"
	height="24"
	class={`circular-progress--${color}`}
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

	.circular-progress--white {
		stroke: white;
	}

	.circular-progress--black {
		stroke: black;
	}

	.circular-progress--primary {
		stroke: var(--color-primary);
	}
</style>
