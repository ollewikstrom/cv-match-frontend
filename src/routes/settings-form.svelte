<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import Dropzone from 'svelte-file-dropzone';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();

	let files: any = $state([]);

	let isDragging = $state(false);

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
					//Check if the value is in the files array. If not, remove it from the FormData
					if (!files.some((file: File) => file.name === value.name)) {
						input.formData.delete(key);
					} else existingFiles.add(value.name); // Assuming file names are unique
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
		files = [];
	}

	function handleFileInput(e: Event) {
		isDragging = false; // Reset drag state
		if (!(e.currentTarget instanceof HTMLInputElement)) return;
		$formData.cvFiles = Array.from(e.currentTarget.files ?? []);
		const newFiles = Array.from((e.target as HTMLInputElement).files ?? []);
		files = [...files, ...newFiles]; // Append new files
	}
	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false; // Reset drag state
		const droppedFiles = Array.from(e.dataTransfer?.files ?? []);
		files = [...files, ...droppedFiles]; // Append dropped files
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true; // Set drag state
	}

	function handleDragLeave() {
		isDragging = false; // Reset drag state
	}

	function removeFileFromList(item: File) {
		files = files.filter((file: File) => file !== item);
	}
</script>

<h1>Settings Form</h1>

<form
	method="POST"
	enctype="multipart/form-data"
	action="?/process"
	class=" min-w-xl flex flex-col gap-4"
	use:enhance
>
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
			<div class="flex flex-col gap-2">
				<Form.Label>CV Files</Form.Label>
				<ol class="flex list-none flex-col gap-2 px-2">
					{#each files as item}
						<li class="flex max-w-lg items-center justify-between gap-2">
							<p class="rounded-md border border-black px-3 py-2">{item.name}</p>
							<Button onclick={() => removeFileFromList(item)} class="bg-red-600 hover:bg-red-400"
								>Remove</Button
							>
						</li>
					{/each}
				</ol>
				<div class="relative flex h-32 flex-col gap-2">
					<label
						for="cvFiles"
						class={`absolute z-0 grid h-full w-full cursor-pointer place-items-center rounded-md border-2 border-dashed` +
							(isDragging ? ' border-blue-500 text-slate-600' : '')}
						>{isDragging ? 'Drop files here' : 'Drop files here or click to select'}
					</label>
					<input
						ondragleave={handleDragLeave}
						ondragover={handleDragOver}
						{...attrs}
						type="file"
						class="pointer-events-auto absolute left-0 top-0 z-50 h-full w-full cursor-pointer opacity-0"
						id="cvFiles"
						accept=".docx"
						name="cvFiles"
						multiple
						oninput={handleFileInput}
					/>
				</div>
			</div>
		</Form.Control>
		<Form.Description>A 'docx' file of the CV(:s) you wish to submit</Form.Description>
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
