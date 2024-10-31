<script lang="ts">
	import { enhance } from '$app/forms';
</script>

Welcome!

<form method="POST" action="?/signin" use:enhance>
	<label>
		Email
		<input name="email" type="email" />
	</label>
	<label>
		Password
		<input name="password" type="password" />
	</label>
	<button>Login</button>
	<button formaction="?/signup">Sign-up</button>
</form>
