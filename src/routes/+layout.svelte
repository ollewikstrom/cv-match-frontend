<script lang="ts">
	import Navbar from '$lib/navbar/Navbar.svelte';
	import '../app.css';
	let { children } = $props();
</script>

<main class="flex min-h-screen flex-col items-center justify-center">
	<Navbar />
	{@render children()}
</main>
