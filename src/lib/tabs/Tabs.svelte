<script lang="ts">
	/** @type {{ value: number, label: string, component: any }[]} */
	export let items: { value: number; label: string; component: any }[] = [];
	export let activeTabValue = 0;
	const handleClick = (tabValue: number) => () => (activeTabValue = tabValue);

</script>

<div class="match-result p-8">
	<ul>
		{#each items as item}
			<li class={activeTabValue === item.value ? 'active' : ''}>
				<span on:click={handleClick(item.value)}>{item.label}</span>
			</li>
		{/each}
	</ul>
	
	{#each items as item}

		{#if activeTabValue == item.value}
			<div class="box  top-0">
				<div class="summary">
					<h1 class="hd1">Summary</h1>
					<h2>{item.component.cv_name}</h2>
					{item.component.summary}
				</div>
				<div class="skills-container">
					<div class="must-have">
						<h1>Must Have</h1>
						{#each item.component.skills as skill }
						{#if skill.level_of_importance == "MUST HAVE" && skill.match_label == "MATCH"}
						<li id = "matches-list" >
						  <text class = "capitalize">{skill.skill_name} </text><br />
						  <p class ="skill-description">{ skill.reason }</p>
						</li>
						{/if}
						{/each}
						{#each item.component.skills as skill }
						{#if skill.level_of_importance == "MUST HAVE" && skill.match_label == "PARTIAL MATCH"}
						<li id = "partial-list">
							<text class = "capitalize">{skill.skill_name} </text><br />
						  <p class ="skill-description">{ skill.reason }</p>
						</li>
						{/if}
						{/each}

						{#each item.component.skills as skill }
						{#if skill.level_of_importance == "MUST HAVE" && skill.match_label == "NO MATCH"}
						<li id = "missing-list">
							<text class = "capitalize">{skill.skill_name} </text><br />
						  <p class ="skill-description">{ skill.reason }</p>
						</li>
						{/if}
						{/each}
					</div>
					<div class="nice-to-have">
						<h1 class="hd1">Nice to Have</h1>
						{#each item.component.skills as skill }
						{#if skill.level_of_importance == "SHOULD HAVE" && skill.match_label == "MATCH"}
						<li id = "matches-list">
							<text class = "capitalize">{skill.skill_name} </text> <br />
						  <p class ="skill-description">{ skill.reason }</p>
						</li>
						{/if}
						{/each}

						{#each item.component.skills as skill }
						{#if skill.level_of_importance == "NICE TO HAVE" && skill.match_label == "MATCH"}
						<li id = "matches-list">
							<text class = "capitalize">{skill.skill_name} </text> <br />
						  <p class ="skill-description">{ skill.reason }</p>
						</li>
						{/if}
						{/each}

						{#each item.component.skills as skill }
						{#if skill.level_of_importance == "SHOULD HAVE" && skill.match_label == "PARTIAL MATCH"}
						<li id = "partial-list">
							<text class = "capitalize">{skill.skill_name} </text> <br />
						  <p class ="skill-description">{ skill.reason }</p>
						</li>
						{/if}
						{/each}

						{#each item.component.skills as skill }
						{#if skill.level_of_importance == "NICE TO HAVE" && skill.match_label == "PARTIAL MATCH"}
						<li id = "partial-list" class = "capitalize">
							<text class = "capitalize">{skill.skill_name} </text> <br />
						  <p class ="skill-description">{ skill.reason }</p>
						</li>
						{/if}
						{/each}
						
						{#each item.component.skills as skill }
						{#if skill.level_of_importance == "SHOULD HAVE" && skill.match_label == "NO MATCH"}
						<li id = "missing-list">
							<text class = "capitalize">{skill.skill_name} </text><br />
						  <p class ="skill-description">{ skill.reason }</p>
						</li>
						{/if}
						{/each}

						{#each item.component.skills as skill }
						{#if skill.level_of_importance == "NICE TO HAVE" && skill.match_label == "NO MATCH"}
						<li id = "missing-list">
							<text class = "capitalize">{skill.skill_name} </text><br />
						  <p class ="skill-description">{ skill.reason }</p>
						</li>
						{/if}
						{/each}

					</div>

				</div>
				
			</div>
		{/if}
	{/each}
</div>


<style>



	.match-result h1 {
		font-size: large;
	}
	.box {
		padding: 40px;
		border: 1px solid #dee2e6;
		border-radius: 0 0 0.5rem 0.5rem;
	}

	ul {
		display: flex;
		flex-wrap: wrap;
		padding-left: 0;
		margin-bottom: 0;
		list-style: none;
		border-bottom: 1px solid #dee2e6;
	}

	li {
		margin-bottom: -1px;
	}

	span {
		
		border: 1px solid #dee2e6;
		border-top-left-radius: 0.25rem;
		border-top-right-radius: 0.25rem;
		display: block;
		padding: 0.5rem 1rem;
		cursor: pointer;
	}

	span:hover {
		border-color: #e9ecef #e9ecef #dee2e6;
	}

	li.active > span {
		color: #495057;
		background-color: #fff;
		border-color: #dee2e6 #dee2e6 #ffff;
		border-bottom: 1px solid #fff;
	}

	.summary {
		padding: 1rem;
	}

	.skills-container {
		display: flex;
		justify-content: space-between;
		padding-top: 1rem;
		gap: 1rem; /* Adjust the gap as needed */
	}
	.skills-container .must-have,
	
	.skills-container .nice-to-have {
		flex: 1;
		padding: 1rem;
		border: 1px solid #90cbf7;
		border-radius: 5px;
	}

	.skill-name {
		list-style-type: none;
		font-size: larger;
		text-transform: capitalize;
	}
	.summary h2,

	.skills h2 {
		margin-bottom: 10px;
		color: #495057;
	}

	.skills ul {
		list-style-type: disc;
		padding-left: 20px;
	}

	.skills li {
		margin-bottom: 5px;
	}

	#matches-list {
		list-style-type: '✅';
	}

	#partial-list {
		list-style-type: '☑️';
	}

	#unsure-list {
		list-style-type: '⚠️';
	}

	#missing-list {
		list-style-type: '❌';
	}
</style>
