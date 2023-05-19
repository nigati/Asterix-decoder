<style>
	main {
	  margin: 0 auto;
	  top: 0px;
	  bottom: 0px;
	  left: 0px;
	  right: 0px;
	  width: 100%;
	  height: 100%;
	}
  
	@media (min-width: 640px) {
	  main {
		max-width: none;
	  }
	}
  
	.ontop {
	  position: absolute;
	  z-index: 100;
	}
	.main {
	  padding: 0;
	  margin: 0;
	  top: 0px;
	  bottom: 0px;
	  left: 0px;
	  right: 0px;
	  width: 100%;
	  height: 100%;
	}
  
	.overflow {
	  overflow-y: hidden;
	  overflow-x: hidden;
	}
  
	#viewDiv {
	  position: relative;
	  width: 100%;
	  height: calc(100vh - 42px);
	}
	#btn-bar {
	  bottom: 20px;
	  background-color: #222222;
  
	  padding: 10px;
	  border-radius: 10px;
	  left: 50%;
	  transform: translate(-50%, 0);
	  width: max-content;
	}
  
	#settings {
	  display: flex;
	  flex-direction: column;
	  gap: 5px;
	  justify-content: center;
	  bottom: 20px;
	  background-color: #222222;
  
	  padding: 10px;
	  border-radius: 10px;
	  left: 10px;
  
	  width: max-content;
	}
  
	#legend {
	  bottom: 20px;
	  background-color: #222222;
  
	  padding: 10px;
	  border-radius: 10px;
	  right: 10px;
  
	  width: max-content;
	}
  
	#planes {
	  left: 10px;
  
	  background-color: #222222;
	  border-radius: 10px;
	}
	.bottom-planes {
	  bottom: 20px;
	  max-height: 650px;
	}
  
	.top-planes {
	  bottom: 215px;
	  max-height: 450px;
	}
	td {
	  vertical-align: middle;
	}
  
	:global(.esri-view .esri-view-surface--inset-outline:focus::after) {
	  outline: none !important;
	}
  
	#progDiv {
	  margin-bottom: 3px;
	}
  
	.color {
	  border-radius: 50%;
	  margin-left: 5px;
	  margin-right: 10px;
	  height: 10px;
	  width: 10px;
	  border-color: black;
	  border-style: solid;
	  border-width: 1px;
	}
	.color-round {
	  border-radius: 50%;
	  margin-right: 10px;
	  height: 20px;
	  width: 20px;
	  border-color: black;
	  border-style: solid;
	  border-width: 1px;
	}
  
	.color-area {
	  margin-left: 5px;
	  margin-right: 10px;
	  height: 15px;
	  width: 15px;
	  border-color: white;
	  border-style: solid;
	  border-width: 1px;
	}
  
	#overlay {
	  position: absolute;
	  width: 100%;
	  height: 100%;
	  top: 0px;
	  background-color: rgba(0, 0, 0, 0.5);
	  z-index: 100;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	}
  </style>
  
  <script lang="ts" type="module">
	import { initializeMap } from "./arcgis/map";
  
	import { fade } from "svelte/transition";
	import type { Cat10 } from "./models/cat10";
	import type { Cat21 } from "./models/cat21";
	import { ipcMainBi } from "./ipcMain";

	import Simulation from "./simulation.svelte";
	import PlanesComponent from "./planesComponent.svelte";
	import { setSMRVisibility, setADSBVisibility, setMLATVisibility } from "./arcgis/groundLayer";
	import { setPlanesLayerVisibility, setPathsLayerVisibility } from "./arcgis/graphicsLayer";
  
	let messages: (Cat10 | Cat21)[] = [];
  
	
	let simulationComponent: Simulation;
  
	let play = false;
	let loading = false;
  
	let settings = false;
	let btncheckSMR = true;
	let btncheckMLAT = true;
	let btncheckADSB = true;
	let btncheckAreas = true;
	let btncheckPlanes = true;
	let btncheckPaths = true;
  
	let performanceData = false;
  
	initializeMap();
  
	
  
	
  
	
	async function handleMapClick() {
	  visibleItem = "MAP";
  
	  initializeMap();
	  if (messages.length > 0) {
		setTimeout(() => {
		  simulationComponent.initializeSimulation!(messages);
		}, 750);
	  }
	}
  
	async function handleMessageDecoderClick() {
	  if (visibleItem === "MAP") simulationComponent.restartSim();
	  visibleItem = "MESSAGE_DECODER";
	}
  
	async function handleParametersResultsClick() {
	  if (visibleItem === "MAP") simulationComponent.restartSim();
	  visibleItem = "PARAMETERS_RESULTS";
	}
  
	
  
	let visibleItem = "MAP";
	
  
	async function kml_file() {
	  console.log("Creating kml file");
  
	  await ipcMainBi("save-kml");
  
	  console.log("KML file written");
	}
  
	function settingsPannel() {
	  settings = !settings;
	}
  </script>
  
  <main>
	<div class="{visibleItem === 'MAP' ? 'main overflow' : 'main'}">
	  {#if messages.length > 0}
		<ul class="nav nav-tabs">
		  <!-- svelte-ignore a11y-click-events-have-key-events -->
		  <li class="nav-item" on:click="{handleMapClick}">
			<a class="{visibleItem === 'MAP' ? 'nav-link active' : 'nav-link'}" href="#a">MAP</a>
		  </li>
		  <!-- svelte-ignore a11y-click-events-have-key-events -->
		  <li class="nav-item" on:click="{handleMessageDecoderClick}">
			<a class="{visibleItem === 'MESSAGE_DECODER' ? 'nav-link active' : 'nav-link'}" href="#a">Table view</a>
		  </li>
		  <!-- svelte-ignore a11y-click-events-have-key-events -->
		  <li class="nav-item" on:click="{handleParametersResultsClick}">
			<a
			  class="{performanceData
				? visibleItem === 'PARAMETERS_RESULTS'
				  ? 'nav-link active'
				  : 'nav-link'
				: 'nav-link disabled'}"
			  href="#a">ED-117 Parameters</a
			>
		  </li>
		</ul>
	  {:else}
		<ul class="nav nav-tabs">
		  <li class="nav-item">
			<a class="nav-link active" href="#a">MAP</a>
		  </li>
		 
		</ul>
	  {/if}
	  {#if visibleItem === "MAP"}
		{#if settings}
		  <div class="ontop dark" id="settings" transition:fade="{{ duration: 100 }}">
			<p>Visible Layers</p>
  
			<div role="group" aria-label="Basic checkbox toggle button group">
			  <input
				type="checkbox"
				bind:checked="{btncheckSMR}"
				on:change="{(e) => {
				  //@ts-ignore
				  setSMRVisibility(e.target.checked);
				}}"
				class="btn-check"
				id="btncheckSMR"
				autocomplete="off"
			  />
			  <label class="btn btn-outline-primary" for="btncheckSMR">SMR</label>
  
			  <input
				type="checkbox"
				bind:checked="{btncheckMLAT}"
				on:change="{(e) => {
				  //@ts-ignore
				  setMLATVisibility(e.target.checked);
				}}"
				class="btn-check"
				id="btncheckMLAT"
				autocomplete="off"
			  />
			  <label class="btn btn-outline-primary" for="btncheckMLAT">MLAT</label>
  
			  <input
				type="checkbox"
				bind:checked="{btncheckADSB}"
				on:change="{(e) => {
				  //@ts-ignore
				  setADSBVisibility(e.target.checked);
				}}"
				class="btn-check"
				id="btncheckADSB"
				autocomplete="off"
			  />
			  <label class="btn btn-outline-primary" for="btncheckADSB">ADSB</label>
			</div>
			<div class="btn-group" role="group" aria-label="Basic checkbox toggle button group">
			  <!-- svelte-ignore missing-declaration -->
			  <input
				type="checkbox"
				bind:checked="{btncheckAreas}"
				on:change="{(e) => {
				  //@ts-ignore
				  setAreasLayerVisibility(e.target.checked);
				}}"
				class="btn-check"
				id="btncheckAreas"
				autocomplete="off"
			  />
			  <label class="btn btn-outline-primary" for="btncheckAreas">MLAT Areas</label>
			</div>
			<div role="group" aria-label="Basic checkbox toggle button group">
			  <input
				type="checkbox"
				bind:checked="{btncheckPlanes}"
				on:change="{(e) => {
				  //@ts-ignore
				  setPlanesLayerVisibility(e.target.checked);
				}}"
				class="btn-check"
				id="btncheckPlanes"
				autocomplete="off"
			  />
			  <label class="btn btn-outline-primary" for="btncheckPlanes">3D Planes</label>
  
			  <input
				type="checkbox"
				bind:checked="{btncheckPaths}"
				on:change="{(e) => {
				  //@ts-ignore
				  setPathsLayerVisibility(e.target.checked);
				}}"
				class="btn-check"
				id="btncheckPaths"
				autocomplete="off"
			  />
			  <label class="btn btn-outline-primary" for="btncheckPaths">3D Paths</label>
			</div>
		  </div>
		{/if}
  
		
		<div class="ontop dark" id="btn-bar">
		  <div id="progDiv">
			<Simulation
			  on:stop="{() => (play = false)}"
			  on:switchplay="{() => (play = !play)}"
			  bind:this="{simulationComponent}"
			/>
		  </div>
		  <div>
			
  
			
			<button
			  type="button"
			  class="{messages.length > 0 ? 'btn btn-primary' : 'btn btn-primary disabled'}"
			  on:click="{kml_file}"
			  ><i class="bi bi-file-earmark-image"></i>
			</button>
			<button type="button" class="btn btn-primary me-3" on:click="{settingsPannel}"
			  ><i class="bi bi-gear"></i>
			</button>
			<button
			  type="button"
			  class="{messages.length > 0 ? 'btn btn-primary' : 'btn btn-primary disabled'}"
			  on:click="{simulationComponent.backwardsTick}"><i class="bi bi-arrow-90deg-left"></i></button
			>
			<button
			  type="button"
			  class="{messages.length > 0 ? 'btn btn-primary' : 'btn btn-primary disabled'}"
			  on:click="{simulationComponent.restartSim}"
			  ><i class="bi bi-arrow-counterclockwise"></i>
			</button>
			<button
			  type="button"
			  class="{messages.length > 0 ? 'btn btn-primary' : 'btn btn-primary disabled'}"
			  on:click="{simulationComponent.seeAllPlanes}"
			  ><i class="bi bi-airplane"></i>
			</button>
			<button
			  type="button"
			  class="{messages.length > 0 ? 'btn btn-primary' : 'btn btn-primary disabled'}"
			  on:click="{simulationComponent.playClick}"
			>
			  {#if play}
				<i class="bi bi-pause"></i>
			  {:else}
				<i class="bi bi-play"></i>
			  {/if}
			</button>
  
			<button
			  type="button"
			  class="{messages.length > 0 ? 'btn btn-primary' : 'btn btn-primary disabled'}"
			  on:click="{simulationComponent.forwardsTick}"
			  ><i class="bi bi-arrow-90deg-right"></i>
			</button>
		  </div>
		</div>
  
		<div class="{settings ? 'top-planes ontop' : 'bottom-planes ontop'}" id="planes">
		  <PlanesComponent />
		</div>
  
		<div id="viewDiv"></div>
	  {/if}
  
	  
	  
	</div>
  
	{#if loading == true}
	  <div id="overlay">
		<div class="d-flex justify-content-center">
		  <div class="spinner-border" role="status">
			<span class="visually-hidden">Loading...</span>
		  </div>
		</div>
	  </div>
	{/if}
  </main>
  