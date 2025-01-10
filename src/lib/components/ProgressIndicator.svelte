<script lang="ts">
	let { color = 'white' }: { color?: 'white' | 'black' | 'primary' } = $props();
</script>

<svg
	width="24"
	height="24"
	viewBox="0 0 24 24"
	class={`progress--${color}`}
	xmlns="http://www.w3.org/2000/svg"
>
	<circle class="progress__dot" cx="4" cy="12" r="3" />
	<circle class="progress__dot" cx="12" cy="12" r="3" />
	<circle class="progress__dot" cx="20" cy="12" r="3" />
</svg>

<svg
	width="24"
	height="24"
	class={`circular-progress--${color}`}
	viewBox="0 0 24 24"
	role="progressbar"
	xmlns="http://www.w3.org/2000/svg"
>
	<g class="circular-progress">
		<circle cx="12" cy="12" r="9.5" fill="none" stroke-width="3"></circle>
	</g>
</svg>

<style>
	.progress__dot {
		animation: jump 1.05s infinite;
	}
	.progress__dot:nth-child(2) {
		animation-delay: 0.1s;
	}
	.progress__dot:last-child {
		animation-delay: 0.2s;
	}
	@keyframes jump {
		0%,
		57.14% {
			animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
			transform: translate(0);
		}
		28.57% {
			animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
			transform: translateY(-6px);
		}
		100% {
			transform: translate(0);
		}
	}

	.progress--white {
		fill: white;
	}

	.progress--black {
		fill: black;
	}

	.progress--primary {
		fill: var(--color-primary);
	}
</style>
