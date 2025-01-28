<script lang="ts">
	import Navbar from '$lib/navbar/Navbar.svelte';
	import '../app.css';
	let { children } = $props();
</script>

<Navbar />
<main class="flex min-h-screen flex-col pt-32">
	{@render children()}
</main>
