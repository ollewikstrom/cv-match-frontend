<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	// export let data: SuperValidated<Infer<FormSchema>>;

	let { data } = $props();

	const form = superForm(data, {
		validators: zodClient(formSchema),
		delayMs: 500,
		timeoutMs: 8000
	});

	const { form: formData, enhance, submitting, delayed, timeout, message } = form;

	if ($message) {
		console.log($message);
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
	<Form.Field {form} name="cvFile">
		<Form.Control let:attrs>
			<Form.Label>CV File</Form.Label>
			<Input
				{...attrs}
				bind:value={$formData.cvFile}
				type="file"
				accept=".docx"
				on:input={(e) => ($formData.cvFile = e.currentTarget.files?.item(0) as File)}
			/>
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
