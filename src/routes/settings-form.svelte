<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Button } from '$lib/components/ui/button';
	import * as Alert from '$lib/components/ui/alert';

	let { data } = $props();

	let files: any = $state([]);

	let isDragging = $state(false);
	let error = $state('');

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
		},
		onError(event) {
			console.log(event);
			error = event.result.error.message;
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

<div class="flex w-96 flex-col gap-4">
	<h2 class="select-none p-8 text-center text-4xl font-bold">CV Input</h2>

	<form
		method="POST"
		enctype="multipart/form-data"
		action="?/process"
		class=" flex w-96 select-none flex-col gap-4"
		use:enhance
	>
		{#if $delayed || $submitting}
			<div class="skeleton flex w-96 animate-pulse flex-col items-center justify-center gap-12 p-6">
				<span class="loading loading-dots loading-lg"></span>
				<p>Analyzing CV and Prospect...</p>
			</div>
		{:else}
			<Form.Field {form} name="jobListing">
				<Form.Control let:attrs>
					<Form.Label class="text-lg">Job Listing URL</Form.Label>
					<Input
						{...attrs}
						bind:value={$formData.jobListing}
						placeholder="Ex. https://app.whoz.com/open/shared/task/6dg7..."
					/>
				</Form.Control>
				<Form.Description>Paste the Whoz URL here</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="cvFiles">
				<Form.Control let:attrs>
					<div class="flex flex-col gap-2">
						<Form.Label class="text-lg">Upload CVs to match</Form.Label>
						<ol class="flex list-none flex-col gap-2 px-2">
							{#each files as item}
								<li class="flex max-w-lg items-center justify-between gap-2">
									<p class="rounded-md border border-black px-3 py-2">{item.name}</p>
									<Button
										onclick={() => removeFileFromList(item)}
										class="bg-red-600 hover:bg-red-400">Remove</Button
									>
								</li>
							{/each}
						</ol>
						<div class="relative flex h-32 flex-col gap-2">
							<label
								for="cvFiles"
								class={`absolute z-0 grid h-full w-full cursor-pointer place-items-center rounded-md border-2 border-dashed` +
									(isDragging ? ' border-blue-500 text-slate-600' : '')}
								>{isDragging ? 'Drop files here' : 'Click to select or drag and drop files here'}
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
				<Form.Description>Only '.docx' files allowed</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Button class="px-8 py-8 text-2xl">Match</Form.Button>
		{/if}
	</form>
	{#if error != ''}
	<div class="relative">

		<Alert.Root variant="destructive">
			<CircleAlert class="h-4 w-4" />
			<Alert.Title>Oh oh!</Alert.Title>
			<Alert.Description>
				{error}. Try again.
			</Alert.Description>
		</Alert.Root>
	</div>
	{/if}
</div>
