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

		let matchId;

		// Extract data from the form
		const { jobListing, cvFile } = form.data;

		try {
			// Create a FormData object to hold the request data
			const formData = new FormData();
			formData.append('job_listing', jobListing);
			formData.append('cv_file', cvFile);

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
			matchId = responseData.match_id;
			console.log('matchId', matchId);

			// Redirect to the match page
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
		throw redirect(308, '/match/' + matchId);
	}
};
