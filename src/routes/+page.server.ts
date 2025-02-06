export const prerender = false;

import type { PageServerLoad, Actions } from './$types.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { actionResult, message, setError, superValidate } from 'sveltekit-superforms';
import { formSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { API_URL } from '$env/static/private';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(formSchema))
	};
};

export const actions: Actions = {
	process: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		let groupId;

		// Extract data from the form
		const { jobListing, cvFiles } = form.data;

		console.log('Number of CV files: ' + cvFiles.length);
		console.log('Job Listing: ' + jobListing);
		console.log('Calling the API: ' + `${API_URL}/processff`);

		try {
			// Create a FormData object to hold the request data
			const formData = new FormData();
			formData.append('job_listing', jobListing);
			// Append the CV files to the FormData object
			cvFiles.forEach((file) => {
				formData.append('cv_files', file);
			});

			// Make the POST request to the backend
			const res = await event.fetch(`${API_URL}/processff`, {
				method: 'POST',
				body: formData
			});

			console.log('res', res);

			// Check the response status
			if (!res.ok) {
				const errorData = await res.json();
				console.log('errorData', errorData);
				throw new Error("Database connection error")
			}

			// Process the response
			const responseData = await res.json();
			console.log('responseData', responseData);
			groupId = responseData.match_group_id;
			// matchId = responseData.match_id;
			// console.log('matchId', matchId);
		} catch (error) {
			console.error('Error making the API request:', error);
			return fail(500, {
				form: {
					...form,
					data: { ...form.data, cvFile: undefined }
				},
				error: 'An unexpected error occurred. Please try again later.'
			});
		}
		return redirect(308, `/match/${groupId}`);
		// return message(form, 'Your CV has been successfully processed.');
	}
};
