<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();

	let files: any = $state([]);

	const form = superForm(data, {
		validators: zodClient(formSchema),
		delayMs: 500,
		timeoutMs: 20000,
		onSubmit: (input) => {
			// Create a Set to keep track of already added files
			const existingFiles = new Set();

			// Iterate over the current FormData to populate the Set
			input.formData.forEach((value, key) => {
				if (key === 'cvFiles' && value instanceof File) {
					existingFiles.add(value.name); // Assuming file names are unique
				}
			});

			// Append files only if they are not already in the Set
			files.forEach((file: File) => {
				if (!existingFiles.has(file.name)) {
					input.formData.append('cvFiles', file);
					existingFiles.add(file.name); // Track the newly added file
				}
			});
		}
	});

	const { form: formData, enhance, submitting, delayed, timeout, message } = form;

	if ($message) {
		console.log($message);
	}

	function handleFileInput(e: any) {
		const newFiles = Array.from(e.currentTarget.files ?? []);
		// Append new files to the existing files
		files = [...files, ...newFiles];
		// $formData.delete('cvFiles');
		console.log(files);
	}
</script>

<h1>Settings Form</h1>

<form method="POST" enctype="multipart/form-data" action="?/process" use:enhance>
	<Form.Field {form} name="jobListing">
		<Form.Control let:attrs>
			<Form.Label>Job Listing</Form.Label>
			<Input {...attrs} bind:value={$formData.jobListing} />
		</Form.Control>
		<Form.Description>A Whoz link to the prospect you wish to compare the CV to</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="cvFiles">
		<Form.Control let:attrs>
			<Form.Label>CV Files</Form.Label>
			<Input
				{...attrs}
				class="'flex disabled:opacity-50' h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed"
				type="file"
				accept=".docx"
				multiple
				oninput={(e) => {
					handleFileInput(e);
					$formData.cvFiles = Array.from(files ?? []);
				}}
			/>
			<ol class="flex list-none flex-col gap-2 pl-4">
				{#each files as item}
					<li class="rounded-md border border-black px-3 py-2">{item.name}</li>
				{/each}
			</ol>
		</Form.Control>
		<Form.Description>A 'docx' file of the CV you wish to submit</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Submit</Form.Button>
	{#if $delayed}
		<p>Submitting...</p>
	{/if}
	{#if $timeout}
		<p>Timeout...</p>
	{/if}
	{#if $message}
		<p>{$message}</p>
	{/if}
	{#if $submitting}
		<p>Submitting...</p>
	{/if}
</form>
