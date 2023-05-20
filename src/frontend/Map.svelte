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
  .btn-primary{
	padding: 0.5em 1em;
    font-size: 1em;
    background-color: #226d3a;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  #legend {
    bottom: 20px;
    background-color: rgba(0, 0, 0, 0.7);

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
  
  :global(.esri-view .esri-view-surface--inset-outline:focus::after) {
    outline: none !important;
  }

  #progDiv {
    margin-bottom: 3px;
  }

  
  
</style>

<script lang="ts" type="module">
  import { initializeMap } from "./arcgis/map";
<<<<<<< HEAD


=======
  import { fade } from "svelte/transition";
>>>>>>> a56291e29039d6c41094c1911629e86995a0f611
  import { ipcMainBi } from "./ipcMain";


  import Simulation from "./simulation.svelte";
  import type { Cat10 } from "./models/cat10";
  import type { Cat21 } from "./models/cat21";

  export let items: (Cat10 | Cat21)[] = [];
  let simulationComponent: Simulation;
  
    
  console.log("play paly");
  console.log(items.length);
  let play = false;
  
  initializeMap();
<<<<<<< HEAD
  
  async function handleMapClick() {
    visibleItem = "MAP";

    
    if (items.length > 0) {
      setTimeout(() => {
        simulationComponent.initializeSimulation!(items);
      }, 750);
    }
  }

=======
>>>>>>> a56291e29039d6c41094c1911629e86995a0f611
  async function kml_file() {
    console.log("Creating kml file");

    await ipcMainBi("save-kml");

    console.log("KML file written");
  }

  let visibleItem = "MAP";
  let i = 0;
</script>


<main>
<<<<<<< HEAD
  <div class="{visibleItem === 'MAP' ? 'main overflow' : 'main'}">
    
    <div class="ontop dark" id="btn-bar">
=======
  <div>
    <div class="ontop light" id="btn-bar">
>>>>>>> a56291e29039d6c41094c1911629e86995a0f611
      <div id="progDiv">
        <Simulation
		{items}
          on:stop="{() => (play = false)}"
          on:switchplay="{() => (play = !play)}"
          bind:this="{simulationComponent}"
        />
      </div>
      <div>
        <button
            type="button"
            class="{items.length > 0 ? 'btn btn-primary' : 'btn btn-primary disabled'}"
            on:click="{kml_file}"
            ><i class="bi bi-file-earmark-image"></i>
          </button>
        <button
              type="button"
              class="{items.length > 0
                ? 'btn btn-primary play-back-button'
                : 'btn btn-primary disabled play-back-button'}"
              on:click="{simulationComponent.restartSim}"
              on:click="{() => {
                simulationComponent.restartSim;
                i=0;
              }}"
              ><i class="bi bi-arrow-counterclockwise"></i>
            </button>
            <button
              type="button"
              class="{items.length > 0
                ? 'btn btn-primary play-back-button'
                : 'btn btn-primary disabled play-back-button'}"
              on:click="{simulationComponent.backwardsTick}"><i class="bi bi-arrow-90deg-left"></i></button
            >
            <button
              type="button"
              class="{items.length > 0
                ? 'btn btn-primary play-button play-button'
                : 'btn btn-primary disabled play-button play-forward-button play-button'}"
<<<<<<< HEAD
              on:click="{() => {
                simulationComponent.playClick();
                if (i === 0) {
                  handleMapClick();
                  i = 1;
                }
              }}"
=======
               on:click="{() => {
				debugger;
				simulationComponent.playClick();
			  }}"
>>>>>>> a56291e29039d6c41094c1911629e86995a0f611
            >
              {#if play}
                <i class="bi bi-pause"></i>
              {:else}
                <i class="bi bi-play"></i>
              {/if}
            </button>

            <button
              type="button"
              class="{items.length > 0
                ? 'btn btn-primary play-forward-button'
                : 'btn btn-primary disabled play-forward-button'}"
              on:click="{simulationComponent.forwardsTick}"
              ><i class="bi bi-arrow-90deg-right"></i>
            </button>
      </div>
    </div>

    
	<div id="viewDiv"></div>
	<div class="legend">
        <div class="light" id="legend" transition:fade="{{ duration: 100 }}">
          <div style="font-size: small">
            <table>
              <tr>
                <td>
                  <div class="color" style="background-color: #fe0000;"></div>
                </td>
                <td>SMR Data Point</td>
              </tr>
              <tr>
                <td>
                  <div class="color" style="background-color: #ffeb16;"></div>
                </td>
                <td>MLAT Data Point</td>
              </tr>
              <tr>
                <td>
                  <div class="color" style="background-color: #6733bb;"></div>
                </td>
                <td>ADS-B Data Point</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

  </div>
</main>
