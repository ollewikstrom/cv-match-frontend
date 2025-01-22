<script lang="ts">
	import type { PageData } from './$types.js';
	import SettingsForm from './settings-form.svelte';
	export let data: PageData;
</script>

<SettingsForm data={data.form} />
<form action="?/bobo" method="POST">
	<button>Click</button>
</form>
