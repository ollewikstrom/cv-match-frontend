import { z } from 'zod';

export const formSchema = z.object({
	jobListing: z
		.string()
		.min(10)
		.max(200)
		.regex(/^https:\/\/app\.whoz\.com\/open\/shared\/task\//, {
			message: 'Please enter a valid job listing URL.'
		}),
	cvFiles: z.instanceof(File, { message: 'Please upload a file.' }).array().min(1)
});

export type FormSchema = typeof formSchema;
