<style>
  #textDiv {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
  }
</style>

<script lang="ts">
  import type { Cat10 } from "./models/cat10";
  import type { Cat21 } from "./models/cat21";
  import {
    createGraphicSMR,
    createGraphicMLAT,
    clearMap,
    deleteGraphicSMR,
    deleteGraphicMLAT,
    deleteGraphicADSB,
    createGraphicADSB,
  } from "./arcgis/groundLayer";
  import { createEventDispatcher } from "svelte";
  import {
    clearGraphicsLayer,
    deleteADSBmessage,
    parseADSBmessage,
    addPath,
    shortenPath,
    clearSeeAll,
    seeAll,
  } from "./arcgis/graphicsLayer";

  export let items: (Cat10 | Cat21)[] = [];
  const dispatch = createEventDispatcher();
console.log(items.length);
  let i = 0;
  let j = 0;
  let slider = 0.1;
  let simStartTime = 0;
  let simTime = 0;
  const tick = 2000; 
  let simEndTime = 0; 

  let play = false;
  let timer: number;

  export function initializeSimulation(msgs: (Cat10 | Cat21)[]) {
    i = 0;

    items = msgs;
   
    if (items[0].cat === "Cat10") {
      simStartTime = getDateCat10(items[0]).getTime();
    } else {
      simStartTime = getDateCat21(items[0]).getTime();
    }

    if (items[items.length - 1].cat === "Cat10") {
      simEndTime = getDateCat10(items[items.length - 1] as Cat10).getTime();
    } else {
      simEndTime = getDateCat21(items[items.length - 1] as Cat21).getTime();
    }

    simTime = simStartTime;
  }

  function getTime(msg: Cat10 | Cat21) {
    if (msg.cat === "Cat10") {
      return msg.time_of_day;
    } else if (msg.cat === "Cat21") return msg.time_report_transmission;
    return -1;
  }

  async function tickSimulation() {
    if (simTime === simEndTime) return;
    if (simTime + tick * slider > simEndTime) {
      simTime = simEndTime;
      stop();
    } else simTime += tick * slider;

    while (getTime(items[i]) * 1000 < simTime) {
      if (items[i].cat === "Cat10") {
        //cat10
        const msg = items[i] as Cat10;
        if (msg.message_type === "Target Report") {
          if (msg.data_src_id.SIC == "107") {
            createGraphicMLAT(msg);
            // parseMLATmessage(msg);
          } else if (msg.data_src_id.SIC === "7") createGraphicSMR(msg);
        }
      } else {
        //cat21
        const msg = items[i] as Cat21;
        createGraphicADSB(msg);
        parseADSBmessage(msg);
      }

      const eraseTime = simTime - 10 * 60 * 1000; //min to sec to ms
      if (eraseTime > simStartTime) {
        while (getTime(items[j]) * 1000 < eraseTime) {
          if (items[j].cat === "Cat10") {
            //cat10
            const msg = items[j] as Cat10;
            if (msg.message_type === "Target Report") {
              if (msg.data_src_id.SIC == "107") {
                deleteGraphicMLAT(msg);
                // parseMLATmessage(msg);
              } else if (msg.data_src_id.SIC === "7") deleteGraphicSMR(msg);
            }
          } else {
            //cat21
            const msg = items[j] as Cat21;
            deleteGraphicADSB(msg);
            shortenPath(msg);
          }
          j += 1;
        }
      }

      i += 1;
    }
  }

  function tickBackSimulation() {
    if (simTime === simStartTime) return;
    if (simTime - tick * slider < simStartTime) {
      simTime = simStartTime;
    } else simTime -= tick * slider;

    if (i < 0) i = 0;

    while (getTime(items[i]) * 1000 > simTime) {
      if (items[i].cat === "Cat10") {
        //cat10
        const msg = items[i] as Cat10;
        if (msg.message_type === "Target Report") {
          if (msg.data_src_id.SIC == "107") {
            deleteGraphicMLAT(msg);
            // deleteMLATmessage(msg);
          } else if (msg.data_src_id.SIC == "7") deleteGraphicSMR(msg);
        }
      } else {
        //cat21
        const msg = items[i] as Cat21;
        deleteGraphicADSB(msg);
        deleteADSBmessage(msg);
      }

      const eraseTime = simTime - 10 * 60 * 1000; //min to sec to ms
      if (eraseTime > simStartTime) {
        while (getTime(items[j]) * 1000 > eraseTime) {
          if (items[j].cat === "Cat10") {
            //cat10
            const msg = items[j] as Cat10;

            if (msg.message_type === "Target Report") {
              if (msg.data_src_id.SIC == "107") {
                createGraphicMLAT(msg);
                // parseMLATmessage(msg);
              } else if (msg.data_src_id.SIC === "7") createGraphicSMR(msg);
            }
          } else {
            //cat21
            const msg = items[j] as Cat21;
            createGraphicADSB(msg);
            addPath(msg);
          }
          j -= 1;
        }
      }

      i -= 1;
      if (i < 0) {
        i = 0;
        break;
      }
    }
  }

  export function playClick() {
    console.log("ESTOY EN PLAYCLICK")
    play = !play;
    dispatch("switchplay");
    if (seeAllBool) {
      seeAllBool = false;
      clearSeeAll();
    }
    if (play) timer = window.setInterval(tickSimulation, 200);
    else clearInterval(timer);
  }
  export function stop() {
    play = false;
    dispatch("stop");
    clearInterval(timer);
  }

  export function restartSim() {
    stop();
    simTime = 0;
    clearMap();
    clearGraphicsLayer();
    initializeSimulation(items);
  }

  export function forwardsTick() {
    stop();
    tickSimulation();
  }

  export function backwardsTick() {
    stop();
    tickBackSimulation();
  }
  let seeAllBool = false;
  export function seeAllPlanes() {
    if (seeAllBool) {
      seeAllBool = false;
      clearSeeAll();
    } else {
      if (play) {
        play = false;

        dispatch("switchplay");
        clearInterval(timer);
      }
      seeAllBool = true;
      seeAll();
    }
  }

  function getDateCat10(m: Cat10) {
    return new Date(m.time_of_day * 1000);
  }

  function getDateCat21(m: Cat21) {
    return new Date(m.time_report_transmission * 1000);
  }

  function getDateFromMilis(milis: number) {
    const d = new Date(milis);

    return d.toISOString().substring(11, 23);
  }

  function round(num: number) {
    return Math.round(num * 100) / 100;
  }
</script>

<div>
  {#if items.length > 0}
    <div class="progress">
      <div id="textDiv">
        {getDateFromMilis(simTime)}
      </div>
      <div
        class="{play ? 'progress-bar progress-bar-striped progress-bar-animated' : 'progress-bar progress-bar-striped'}"
        role="progressbar"
        aria-label="Simulation progress"
        style="width: {round(((simTime - simStartTime) / (simEndTime - simStartTime)) * 100)}%;"
        aria-valuenow="{round(((simTime - simStartTime) / (simEndTime - simStartTime)) * 100)}"
        aria-valuemin="{0}"
        aria-valuemax="{100}"
      ></div>
    </div>
    <div style="width: 100%; display: table; padding-top: 3px;">
      <div style="display: table-row">
        <div style="width: 40px; display: table-cell;">
          <label for="range" class="form-label">x{Math.round(10 * slider)}</label>
        </div>
        <div style="display: table-cell;">
          <input bind:value="{slider}" type="range" class="form-range" min="0.1" max="2" step="0.1" id="range" />
        </div>
      </div>
    </div>
  {/if}
</div>

