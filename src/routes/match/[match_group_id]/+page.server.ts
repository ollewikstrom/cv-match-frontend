export const prerender = false;

import { API_URL } from '$env/static/private';

export async function load({ params }: { params: { match_group_id: string } }) {
	const match_group_id = params.match_group_id;
	console.log('match_group_id', match_group_id);

	console.log('Calling the API on: ' + `${API_URL}/match_group/${match_group_id}`);

	const matchData = await fetch(API_URL + '/match_group/' + match_group_id).then((res) =>
		res.json()
	);
	console.log('matchData', matchData);

	return {
		matchData
	};
}
