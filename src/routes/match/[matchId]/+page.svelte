<script lang="ts">
	let { data } = $props();

	let { matchData } = data;

	console.log(matchData);
</script>

<h1>Welcome to the Match</h1>
{#await matchData}
	<p>Loading...</p>
{:then matchData}
	<p>{matchData.match_id}</p>
{:catch error}
	<p>{error.message}</p>
{/await}
