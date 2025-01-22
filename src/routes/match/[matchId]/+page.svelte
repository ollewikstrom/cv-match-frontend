<script lang="ts">
	let matchData = $props();

	console.log(matchData);
</script>

<h1>Welcome to the Match</h1>
{#await matchData}
	<p>Loading...</p>
{:then matchData}
	<pre>{JSON.stringify(matchData, null, 2)}</pre>
{:catch error}
	<p>{error.message}</p>
{/await}
