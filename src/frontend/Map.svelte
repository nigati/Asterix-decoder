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
  S
  <script lang="ts" type="module">
	import { initializeMap } from "./arcgis/map";

	import {  ipcMainBi  } from "./ipcMain";

	import Simulation from "./simulation.svelte";
	import PlanesComponent from "./planesComponent.svelte";
	import ExpandableTable from "./ExpandableTable.svelte";
	
	  

  
	
	
  let simulationComponent: Simulation;
  console.log("play paly");

  let play = false;
  let loading = false;

  
  

  
	
  
  
	initializeMap();
  

	let visibleItem = "MAP";
	
  
	async function kml_file() {
	  console.log("Creating kml file");
  
	  await ipcMainBi("save-kml");
  
	  console.log("KML file written");


	}
  
	
  </script>
  
  <main>
	<div >
	  
	 
		
  
		
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
			  class="btn btn-primary"
			  on:click="{kml_file}"
			  ><i class="bi bi-file-earmark-image"></i>
			</button>
			
			<button
			  type="button"
			  class="btn btn-primary"
			  on:click="{simulationComponent.backwardsTick}"><i class="bi bi-arrow-90deg-left"></i></button
			>
			<button
			  type="button"
			  class="btn btn-primary"
			  on:click="{simulationComponent.restartSim}"
			  ><i class="bi bi-arrow-counterclockwise"></i>
			</button>
			<button
			  type="button"
			  class="btn btn-primary"
			  on:click="{simulationComponent.seeAllPlanes}"
			  ><i class="bi bi-airplane"></i>
			</button>
			<button
			  type="button"
			  class="btn btn-primary"
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
			  class="btn btn-primary"
			  on:click="{simulationComponent.forwardsTick}"
			  ><i class="bi bi-arrow-90deg-right"></i>
			</button>
		  </div>
		</div>
  
		<div class="btn btn-primary" id="planes">
		  <PlanesComponent />
		</div>
  
		<div id="viewDiv"></div>
	  
  
	  {#if visibleItem === "MESSAGE_DECODER"}
      <div>
        <ExpandableTable />
      </div>
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
  