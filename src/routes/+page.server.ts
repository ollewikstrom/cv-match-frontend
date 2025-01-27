import type { PageServerLoad, Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';
import { actionResult, message, superValidate } from 'sveltekit-superforms';
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

		// let matchId;

		// Extract data from the form
		const { jobListing, cvFiles } = form.data;

		console.log(cvFiles.length);

		try {
			// Create a FormData object to hold the request data
			const formData = new FormData();
			formData.append('job_listing', jobListing);
			// Append the CV files to the FormData object
			cvFiles.forEach((file) => {
				formData.append('cv_files', file);
			});

			// Make the POST request to the backend
			const res = await event.fetch(`${API_URL}/process`, {
				method: 'POST',
				body: formData
			});

			// Check the response status
			if (!res.ok) {
				const errorData = await res.json();
				return fail(res.status, {
					form,
					error: errorData.detail || 'An error occurred while processing your request.'
				});
			}

			// Process the response
			const responseData = await res.json();
			console.log('responseData', responseData);
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
		return message(form, 'Your CV has been successfully processed.');
	}
};
