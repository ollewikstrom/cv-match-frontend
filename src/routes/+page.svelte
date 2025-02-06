<script lang="ts">
	import type { PageData } from './$types.js';
	import SettingsForm from './settings-form.svelte';
	export let data: PageData;
</script>

<div class="w-screen h-full flex flex-col items-center justify-center">
	<SettingsForm data={data.form} />
</div>
