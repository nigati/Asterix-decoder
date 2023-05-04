<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
  th {
    color: black;
    font-size: medium;
  }
  
  td {
    color: black;
    font-size: small;
  }

  th, td {
    text-align: left;
    padding: 8px;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<script lang="ts" type="module">
  import type { Cat10 } from "../electron/models/cat10";
  import type { Cat21 } from "../electron/models/cat21";
  import { initIpcMain, ipcMainBi,parseIpcMainReceiveMessage } from "./ipcMain";
  

  let items: (Cat10|Cat21) []=[];
  let items_len= 0;
  let loading=false;


  async function handleLoadSomeItems() {
    items_len = Number.parseInt(await initIpcMain("load-file"));
    if (!items_len) return;
    
    items = [];
    loading = true;
    console.log({ data_len: items_len });
    const FRAGMENTS = 100000;
    let i = 0;
    await ipcMainBi("load-items", 10000);
    while (i < items_len) {
      const items1 = await ipcMainBi("slice-em-up");
      items = items.concat(await parseIpcMainReceiveMessage(items1));
      i += FRAGMENTS;
    }
  
    loading = false;
  }
</script>


 <main>
  <h1>ASTERIX DECODER</h1>
  <button type="button" class="btn btn-primary" on:click="{handleLoadSomeItems}">PICK FILE</button>  
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Class</th>
          <th>Instrument</th>
          <th>Target Id</th>
          <th>Data source identifier</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {#each items as item}
          {#if item.cat === "Cat10" }
            <tr class:smr={item.instrument === 'SMR'} class:mlat={item.instrument === 'MLAT'}>
              <td>{item.id}</td>
              <td>{item.cat}</td>
              <td>{item.instrument}</td>
              <td>{item.message_type}</td>
              <td>{item.data_src_id.SIC}</td>
              <td>{item.time_of_day}</td>
            </tr>
          {:else}
            <tr>
              <td>{item.id}</td>
              <td>{item.cat}</td>
              <td>{item.instrument}</td>
              <td>{item.target_identification}</td>
              <td>{`SIC: ${item.data_source_identification.SIC}; SAC: ${item.data_source_identification.SAC}`}</td>
              <td>{new Date(item.time_report_transmission * 1000).toISOString().substring(11, 23)}</td>
            </tr>
            {/if}
        {/each}
      </tbody>
     </table>
</main>


