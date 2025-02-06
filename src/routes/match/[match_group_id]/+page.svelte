<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import { Button, ButtonGroup, Tooltip } from 'flowbite-svelte';
	//import SvelteCopyUrlButton from 'svelte-copy-url-button';
	import { match } from 'effect/ChildExecutorDecision';
	import { url } from 'effect/Config';
	let { data } = $props();
	//let {jobData} = $props();
	let { matchData } = data;
	let { match_group_id, job_listing_url, matches, job_listing_name } = matchData;
	console.log(matchData);

	let placeholderText = '';

	function handleClick() {
		placeholderText = 'Processing...';
		setTimeout(() => {
			placeholderText = '';
		}, 3000); // Reset after 3 seconds
	}
	const matchType = new Map([
		['MATCH', `list-['✅']`],
		['PARTIAL MATCH', `list-['☑️']`],
		['UNSURE', `list-['⚠️']`],
		['NO MATCH', `list-['❌']`]
	]);

	const matchTypeDesc = new Map([
		['MATCH', 'This skill is a match'],
		['PARTIAL MATCH', 'This skill is a partial match'],
		['UNSURE', 'This skill is unsure'],
		['NO MATCH', 'This skill is not a match']
	]);
</script>

{#await data}
	<p>Loading...</p>
{:then data}
	<div class="flex w-full flex-col pl-8 pr-8 pt-8">
		<ButtonGroup class="*:!ring-primary-700  ml-auto">
			<Button
				on:click
				class="rounded-bl-md rounded-tl-md bg-blue-100   hover:bg-blue-300 hover:text-white hover:shadow-2xl"
				><a href={job_listing_url} target="_blank">Prospect</a></Button
			>
			<Tooltip class="opacity-2 gap-y-10 bg-slate-600 text-white">Go to the job listing</Tooltip>
			<Button
				class="rounded-br-md rounded-tr-md bg-blue-100 hover:bg-blue-300 hover:text-white"
				on:click={() => {
					navigator.clipboard
						.writeText(window.location.href)
						.then(() => {
							alert('URL copied to clipboard!');
						})
						.catch((err) => {
							console.error('Failed to copy: ', err);
						});
				}}>Copy link</Button
			>
			<Tooltip class="opacity-2 gap-y-10 bg-slate-600 text-white">Copy URL to clipboard</Tooltip>
		</ButtonGroup>
	</div>

	<Tabs.Root value={matches[0].match_id} class=" p-8 pt-4">
		<Tabs.List class="flex h-fit flex-wrap gap-2 bg-blue-100 p-2 text-slate-600">
			{#each matches as match}
				<Tabs.Trigger
					id="tabs-button"
					value={match.match_id}
					class="max-w-xs justify-start  bg-slate-300"
					><span id="cvname" class="overflow-hidden text-ellipsis">{match.cv_name}</span>
					<Tooltip class="opacity-2 gap-y-10 bg-slate-600 text-white">
						{match.cv_name}
					</Tooltip>
				</Tabs.Trigger>
			{/each}
		</Tabs.List>

		{#each matches as match}
			<Tabs.Content value={match.match_id} class="solid rounded-lg border-2 border-blue-100 p-12">
				<div>
					<h1 class="py-2 text-3xl">Summary</h1>
					<h2>{match.cv_name}</h2>
					<p class="py-2">{match.summary}</p>
				</div>

				<h1 class=" py-2 text-3xl">Skills</h1>
				<div class="space-between border-1px flex gap-4 border-lblue">
					<div class="border-1px flex flex-1 flex-col rounded-lg border-2 border-blue-100 p-4">
						<h1 class="text-2xl">Required</h1>
						{#each match.skills as skill}
							{#if skill.level_of_importance == 'MUST HAVE'}
								<ul class={'flex list-inside  p-1 ' + matchType.get(skill.match_label)}>
									<li class=" text-xl capitalize">{skill.skill_name}</li>
									<Tooltip class=" bg-slate-600  text-white">
										<span> {matchTypeDesc.get(skill.match_label)}</span>
									</Tooltip>
								</ul>
								<p class="text-md pb-2">{skill.reason}</p>
							{/if}
						{/each}
					</div>

					<div class="border-1px flex flex-1 flex-col rounded-lg border-2 border-blue-100 p-4">
						<h1 class="text-2xl">Optional</h1>
						{#each match.skills as skill}
							{#if skill.level_of_importance != 'MUST HAVE'}
								<ul class={'list-inside p-1 ' + matchType.get(skill.match_label)}>
									<li class="text-xl capitalize">{skill.skill_name}</li>
									<Tooltip placement="left" class="opacity-2  bg-slate-600 text-white">
										{matchTypeDesc.get(skill.match_label)}
									</Tooltip>
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
