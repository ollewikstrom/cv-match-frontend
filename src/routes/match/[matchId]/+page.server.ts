import { API_URL } from '$env/static/private';

export async function load({ params }) {
	const matchId = params.matchId;
	console.log('matchId', matchId);

	const matchData = await fetch(API_URL + '/match/' + matchId).then((res) => res.json());
	console.log('matchData', matchData);

	return {
		matchData
	};
}
