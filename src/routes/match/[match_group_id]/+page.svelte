<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import { match } from 'effect/ChildExecutorDecision';
	let { data } = $props();
	let { matchData } = data;
	let { match_group_id, job_listing_url, matches, job_listing_name } = matchData;
	console.log(matchData);

	const matchType = new Map([
		['MATCH', `list-['✅']`],
		['PARTIAL MATCH', `list-['☑️']`],
		['UNSURE', '⚠️'],
		['NO MATCH', `list-['❌']`]
	]);
</script>

{#await data}
	<p>Loading...</p>
{:then data}
	<div class="flex items-center justify-between p-4">
		<h1 class="text-3xl">{job_listing_name}</h1>
		<a href={job_listing_url} target="_blank" class="text-xl text-blue-500 underline"
			>View Job Listing</a
		>
	</div>
	<Tabs.Root value={matches[0].match_id} class=" p-8 ">
		<Tabs.List class="flex h-fit flex-wrap gap-2 bg-blue-100 text-slate-600">
			{#each matches as match}
				<Tabs.Trigger value={match.match_id} class=" bg-slate-300">{match.match_id}</Tabs.Trigger>
			{/each}
		</Tabs.List>
		{#each matches as match}
			<Tabs.Content value={match.match_id} class="solid  rounded-lg border-2 border-blue-100 p-12">
				<div>
					<h1 class="text-3xl">Summary</h1>
					<h2>{match.cv_name}</h2>
					<p class="py-2">{match.summary}</p>
				</div>

				<h1 class=" py-2 text-3xl">Skills</h1>
				<div class="space-between border-1px border-lblue flex gap-4">
					<div class="border-1px flex flex-1 flex-col rounded-lg border-2 border-blue-100 p-4">
						<h1 class="text-2xl">Required</h1>
						{#each match.skills as skill}
							{#if skill.level_of_importance == 'MUST HAVE'}
								<ol class={' list-inside p-1 ' + matchType.get(skill.match_label)}>
									<li class="text-xl capitalize">{skill.skill_name}</li>
									<p class="text-md">{skill.reason}</p>
								</ol>
							{/if}
						{/each}
					</div>

					<div class="border-1px flex flex-1 flex-col rounded-lg border-2 border-blue-100 p-4">
						<h1 class="text-2xl">Optional</h1>
						{#each match.skills as skill}
							{#if skill.level_of_importance != 'MUST HAVE'}
								<ul class={'list-inside p-1 ' + matchType.get(skill.match_label)}>
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
