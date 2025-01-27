<script lang="ts">
	import Tabs from '$lib/tabs/Tabs.svelte';
	let { data } = $props();
	let { matchData } = data;
	let { match_group_id, job_listing_url, matches, job_listing_name } = matchData;
	console.log(matchData);

// Using `.map()` to create `items` from `matches`
const items = matches.map((match: { match_id: string, cv_name: string; summary: string; skills: string[] }, index: number) => {
  return {
    label:  `CV ${index + 1}`,
    value: index,
    component: {
		match_id: match.match_id, 
		cv_name: match.cv_name, 
		summary: match.summary, 
		skills: match.skills}
  };
});
</script>

{#await data}
	<p>Loading...</p>
{:then data}
	<Tabs {items} />
{:catch error}
	<p>{error.message}</p>
{/await}
