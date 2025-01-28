<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	let { data } = $props();
	let { matchData } = data;
	let { match_group_id, job_listing_url, matches, job_listing_name } = matchData;
	console.log(matchData);

	const matchType = new Map([
		['MATCH', `list-['✅']`],
		['PARTIAL MATCH', `list-['☑️']`],
		['NO MATCH', `list-['❌']`]
	]);
</script>

{#await data}
	<p>Loading...</p>
{:then data}
	<Tabs.Root value={matches[0].match_id} class="p-8">
		<Tabs.List class="flex flex-wrap">
			{#each matches as match}
				<Tabs.Trigger value={match.match_id}>{match.match_id}</Tabs.Trigger>
			{/each}
		</Tabs.List>
		{#each matches as match}
			<Tabs.Content value={match.match_id} class="solid #90cbf7 border-2 p-4">
				<div>
					<h1 class="text-3xl">Summary</h1>
					<h2>{match.cv_name}</h2>
					{match.summary}
				</div>

				<h1 class=" text-3xl">Skills</h1>
				<div class="space-between border-1px flex gap-4">
					<div class="border-1px flex flex-1 flex-col border-2 p-4">
						<h1 class="text-2xl">Required</h1>
						{#each match.skills as skill}
							{#if skill.level_of_importance == 'MUST HAVE'}
								<ol class={' list-inside ' + matchType.get(skill.match_label)}>
									<li class="text-xl capitalize">{skill.skill_name}</li>
									<p class="text-md">{skill.reason}</p>
								</ol>
							{/if}
						{/each}
					</div>

					<div class="border-1px flex flex-1 flex-col border-2 p-4">
						<h1 class="text-2xl">Optional</h1>
						{#each match.skills as skill}
							{#if skill.level_of_importance != 'MUST HAVE'}
								<ul class={'list-inside ' + matchType.get(skill.match_label)}>
									<li class="text-xl capitalize">{skill.skill_name}</li>
									<p class="text-md">{skill.reason}</p>
								</ul>
							{/if}
						{/each}
					</div>
				</div>
			</Tabs.Content>
		{/each}
	</Tabs.Root>
{:catch error}
	<p>{error.message}</p>
{/await}
```
