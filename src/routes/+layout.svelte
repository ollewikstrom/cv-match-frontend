<script lang="ts">
	import Navbar from '$lib/navbar/Navbar.svelte';
	import '../app.css';
	let { children } = $props();
</script>

<Navbar />
<main class="flex flex-col pt-36 min-h-[calc(100vh-9rem)] items-center justify-center">
	{@render children()}
</main>
