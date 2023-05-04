<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
  .pagination ul {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
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
let page = 0;
let totalPages: (Cat10|Cat21)[][] = [];
let currentPageRows: (Cat10|Cat21)[] = [];
  let itemsPerPage = 20;

  let loading=false;

  $: currentPageRows = totalPages.length > 0 ? totalPages[page] : [];
  $: console.log("Page is", page);

  const paginate = (items: (Cat10|Cat21) []) => {
  const pages = Math.ceil(items.length / itemsPerPage);

  const paginatedItems = Array.from({ length: pages }, (_, index) => {
    const start = index * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  });

  console.log("paginatedItems are", paginatedItems);
  totalPages = [...paginatedItems];
};
  async function handleLoadSomeItems() {
    items_len = Number.parseInt(await initIpcMain("load-file"));
    if (!items_len) return;
    
    items = [];
    loading = true;
    console.log({ data_len: items_len });
    const FRAGMENTS = 100;
    let i = 0;
    await ipcMainBi("load-items", 100);
    while (i < items_len) {
      const items1 = await ipcMainBi("slice-em-up");
      items = items.concat(await parseIpcMainReceiveMessage(items1));
      i += FRAGMENTS;
    }
  
    loading = false;
    paginate(items);
  }
  const setPage = (p: number) => {
  if (p >= 0 && p < totalPages.length) {
    page = p;
  }
};
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
        {#each currentPageRows as item}
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
     <nav class="pagination">
      <ul>
        <li>
          <button
            type="button"
            class="btn-next-prev"
            on:click={() => setPage(page - 1)}
            disabled={page === 0}
          >
            PREV
          </button>
        </li>
    
        {#if page > 1}
          <li>
            <button
              type="button"
              class="btn-page-number"
              on:click={() => setPage(0)}
            >
              1
            </button>
          </li>
          <li><span class="ellipsis">...</span></li>
        {/if}
    
        {#if page > 0}
          <li>
            <button
              type="button"
              class="btn-page-number"
              on:click={() => setPage(page - 1)}
            >
              {page}
            </button>
          </li>
        {/if}
    
        <li><span class="current-page">{page + 1}</span></li>
    
        {#if page < totalPages.length - 1}
          <li>
            <button
              type="button"
              class="btn-page-number"
              on:click={() => setPage(page + 1)}
            >
              {page + 2}
            </button>
          </li>
        {/if}
    
        {#if page < totalPages.length - 2}
          <li><span class="ellipsis">...</span></li>
          <li>
            <button
              type="button"
              class="btn-page-number"
              on:click={() => setPage(totalPages.length - 1)}
            >
              {totalPages.length}
            </button>
          </li>
        {/if}
    
        <li>
          <button
            type="button"
            class="btn-next-prev"
            on:click={() => setPage(page + 1)}
            disabled={page === totalPages.length - 1}
          >
            NEXT
          </button>
        </li>
      </ul>
    </nav>
</main>


