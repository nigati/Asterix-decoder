<style>
  main {
    background-color: rgba(204, 239, 233, 255);
    margin-left: 240px; 
    overflow: auto;
    height: 100vh;
    align-items: center;
    flex-direction: column;
    position: relative;
    padding-bottom: 60px; 
    overflow-x: auto;
  }

  #load-file {
    padding: 1em;
  }

  #load-file h2 {
    color: #226d3a;
    font-size: 2em;
    font-weight: bold;
    margin-bottom: 1em;
  }

  #load-file p {
    font-size: 1.1em;
    line-height: 1.5;
    margin-bottom: 1em;
    color: #226d3a;
  }

  #load-file button {
    padding: 0.75em 1em;
    font-size: 1em;
    display: inline-block;
    border: 1px solid #226d3a;
    border-radius: 0;
    background-color: transparent;
    color: #226d3a;
    text-decoration: none;
    outline: none;
    cursor: pointer;
  }

  #load-file button:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  #load-file button:focus {
    outline: 2px solid #226d3a;
  }
  #sidebar {
    min-width: 240px;
    max-width: 240px;
    background: #6c9c8c;
    color: #fff;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
  }
  #sidebar h1 {
    color: #226d3a;
    text-transform: uppercase;
    font-size: 2em;
    font-weight: 100;
    white-space: normal; 
    overflow: hidden; 
    text-overflow: ellipsis; 
  }
  .list-unstyled {
    padding: 0;
    margin: 0;
  }
li.disabled{
  opacity: 0.5; /* Lower opacity to indicate disabled state */
  pointer-events: none; /* Disable pointer events */
  cursor: not-allowed; /* Show not-allowed cursor on hover */
}
  .list-unstyled li {
    border-bottom: 1px solid #ccc;
  }

  .list-unstyled li:last-child {
    margin-bottom: 0;
  }

  .list-unstyled li a {
    display: block;
    padding: 12px;
    font-size: 1.1em; 
    color: #226d3a;
  }
  td.expandedColumn {
    width: 400px; 
  }

  .pagination {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px;
    background-color: rgba(0, 0, 0, 0.25);
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translateZ(0);
    z-index: 999; 
  }

  .pagination ul {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .pagination li {
    margin: 0 5px;
  }

  .pagination button {
    padding: 0.5em 1em;
    font-size: 1em;
    background-color: #226d3a;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .pagination button:hover {
    background-color: #314fdd;
  }

  .pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  th {
    color: #226d3a;
    font-size: medium;
    border-bottom: 2px solid black; 
    border-right: 2px solid black; 
    border-top: 2px solid black;
    border-left: 2px solid black;
  }
  td {
    color: #226d3a;
    font-size: small;
    text-align: left;
    padding: 8px;
    width: max-content;
    border-bottom: 1px solid black; 
    border-right: 1px solid black; 
    border-left: 1px solid black;
  }
  tr.smr {
    background-color: #a1c4bd;
  }

  tr.mlat {
    background-color: lightblue;
  }
  h1 {
    color: #226d3a;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
  h2 {
    color: #226d3a;
    font-size: 2em;
    font-weight: bold;
    margin-bottom: 1em;
  }
  .mytable {
    margin-top: 10px;
    width: 100%;
  }
  .button-row {
    display: flex;
    align-items: center;
    gap: 25px;
  }
  .style-button {
    padding: 0.75em 1em;
    font-size: 1em;
    display: inline-block;
    border: 1px solid #226d3a;
    border-radius: 0;
    background-color: transparent;
    color: #226d3a;
    text-decoration: none;
    outline: none;
    cursor: pointer;
  }

  .style-button:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  .style-button:focus {
    outline: 2px solid #226d3a;
  }
  .active {
    background-color: #f0f0f0;
    color: #333;
  }
  .about{
    margin-top: auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<script lang="ts" type="module">
  import { FileEarmarkPlus, House, Table, Plus, QuestionCircle} from "svelte-bootstrap-icons";
  import { Map as MapIcon } from "svelte-bootstrap-icons";
  import type { Cat10 } from "./models/cat10";
  import type { Cat21 } from "./models/cat21";
  import { initIpcMain, ipcMainBi, parseIpcMainReceiveMessage } from "./ipcMain";
  import Map from "./Map.svelte";
  import Home from "./routes/home.svelte";

  let items: (Cat10 | Cat21)[] = [];
  let items_len = 0;
  let cat10Count = 0;
  let cat21Count = 0;
  let page = 0;
  let totalPages: (Cat10 | Cat21)[][] = [];
  let currentPageRows: (Cat10 | Cat21)[] = [];
  let itemsPerPage = 100;
  let filteredItems: (Cat10 | Cat21)[] = [];
  let loading = false;

  let activeWindow = "home";

  let expandedRows: (Cat10 | Cat21)[] = [];
  let expandedItem: Cat10 | Cat21 | null;

  $: currentPageRows = totalPages.length > 0 ? totalPages[page] : [];
  $: console.log("Page is", page);

  let selectedCategory = "";
  let selectedInstrument = "";
  let searchTargetID = "";
  const categories = ["Cat10", "Cat21"];
  const instruments = ["ADS-B", "MLAT", "SMR"];

  const paginate = (items: (Cat10 | Cat21)[]) => {
    const filteredPages = Math.ceil(items.length / itemsPerPage);

    const paginatedItems = Array.from({ length: filteredPages }, (_, index) => {
      const start = index * itemsPerPage;
      return items.slice(start, start + itemsPerPage);
    });

    console.log("paginatedItems are", paginatedItems);
    totalPages = [...paginatedItems];
  };

  async function handleLoadSomeItems() {
    items_len = Number.parseInt(await initIpcMain("load-file"));
    if (!items_len) return;
    cat10Count = 0;
    cat21Count = 0;
    items = [];
    loading = true;
    console.log({ data_len: items_len });
    const FRAGMENTS = 1000;
    let i = 0;
    await ipcMainBi("load-items", 1000);
    while (i < items_len) {
      const items1 = await ipcMainBi("slice-em-up");
      items = items.concat(await parseIpcMainReceiveMessage(items1));
      i += FRAGMENTS;
    }
    items.forEach((item) => {
      if (item.cat === "Cat10") {
        cat10Count++;
      } else if (item.cat === "Cat21") {
        cat21Count++;
      }
    });

    loading = false;
    paginate(items);
  }
  const setPage = (p: number) => {
    if (p >= 0 && p < totalPages.length) {
      page = p;
    }
  };
  function expandRow(item: Cat10 | Cat21) {
    if (expandedRows.includes(item)) {
      expandedRows = expandedRows.filter((row) => row !== item);
    } else {
      expandedRows.push(item);
    }
    console.log(expandedRows);
    updateTable();
  }

  function htmlToCsvAll(filename: any) {
    var csv: string[] = [];
    updateTable();
    for (var page = 1; page <= totalPages.length; page++) {
      setPage(page);
      var rows = document.querySelectorAll("table tr");
  for (var i = 0; i < rows.length; i++) {
    var row = [];
    var cols = rows[i].querySelectorAll("td,th");
    
    for (var j = 0; j < cols.length; j++) {
      var cellData = cols[j].textContent;
      
      // Check if the column has an expandable button
      if (cols[j].classList.contains("expandedColumn")) {
        var expandButton = cols[j].querySelector("button.style-button");
        
        // If the expand button is present, retrieve the expanded data
        if (expandButton) {
          var expandedData = expandButton.parentNode?.querySelectorAll("div");
          if (expandedData) {
            cellData = Array.from(expandedData).map(function (element) {
              return element.textContent?.trim() || "";
            }).join(", ");
          }
        }
      }
      
      row.push(cellData);
    }
    
    csv.push(row.join("\t")); // Use tab as the delimiter
  }
    }

    downloadCSVFile(csv.join("\n"), filename);
  }
  /* function htmlToCsvAll(filename: any) {
    var csv: string[] = [];
    updateTable();
    for (var page = 1; page <= totalPages.length; page++) {
      setPage(page);
      var rows = document.querySelectorAll("table tr");

      for (var i = 0; i < rows.length; i++) {
        var row = [];
        var cols = rows[i].querySelectorAll("td,th");
        for (var j = 0; j < cols.length; j++) {
          row.push(cols[j].innerHTML);
        }
        csv.push(row.join(","));
      }
    }

    downloadCSVFile(csv.join("\n"), filename);
  } */
  /* function htmlToCsv(filename: any) {
    var csv: string[] = [];
    var rows = document.querySelectorAll("table tr");

    for (var i = 0; i < rows.length; i++) {
      var row = [];
      var cols = rows[i].querySelectorAll("td,th");
      for (var j = 0; j < cols.length; j++) {
        row.push(cols[j].innerHTML);
      }
      csv.push(row.join(","));
    }

    downloadCSVFile(csv.join("\n"), filename);
  } */

  function htmlToCsv(filename: any) {
  var csv: string[] = [];
  var rows = document.querySelectorAll("table tr");
  for (var i = 0; i < rows.length; i++) {
    var row = [];
    var cols = rows[i].querySelectorAll("td,th");
    
    for (var j = 0; j < cols.length; j++) {
      var cellData = cols[j].textContent;
      
      // Check if the column has an expandable button
      if (cols[j].classList.contains("expandedColumn")) {
        var expandButton = cols[j].querySelector("button.style-button");
        
        // If the expand button is present, retrieve the expanded data
        if (expandButton) {
          var expandedData = expandButton.parentNode?.querySelectorAll("div");
          if (expandedData) {
            cellData = Array.from(expandedData).map(function (element) {
              return element.textContent?.trim() || "";
            }).join(", ");
          }
        }
      }
      
      row.push(cellData);
    }
    
    csv.push(row.join("\t")); // Use tab as the delimiter
  }

  downloadCSVFile(csv.join("\n"), filename);
}

  function handleNavClick(active: string) {
    activeWindow = active;
    console.log(activeWindow);
  }
  function downloadCSVFile(csv: BlobPart, filename: string) {
    var csv_file;
    var download_link;
    csv_file = new Blob([csv], { type: "text/csv" });
    download_link = document.createElement("a");
    download_link.download = filename;
    download_link.href = window.URL.createObjectURL(csv_file);
    download_link.style.display = "none";
    document.body.appendChild(download_link);
    download_link.click();
  }

  $: {
    console.log(searchTargetID);
    const filteredItems = items.filter((item) => {
      const isCategoryMatch = selectedCategory === "" || item.cat === selectedCategory;
      const isInstrumentMatch = selectedInstrument === "" || item.instrument === selectedInstrument;
      return isCategoryMatch && isInstrumentMatch;
    });
    paginate(filteredItems);
    updateTable();
  }

  function updateTable() {
    currentPageRows = totalPages.length > 0 ? totalPages[page] : [];
  }
  function Shrink() {
    expandedRows = [];
    console.log(expandedRows);
  }
  function expandAllItems1(){
    expandedRows=items;
    setTimeout(function () {
  htmlToCsv("file");
}, 1000);

  }
  function expandAllItems2(){
    expandedRows=items;
    setTimeout(function () {
  htmlToCsvAll("file");
}, 1000);
  }

</script>

<div class="sidebarr">
  <nav id="sidebar" class="{activeWindow === 'home' ? 'active' : ''}">
    <h1><strong>Asterix Decoder</strong></h1>
    <ul class="list-unstyled components mb-5">
      <li class="{activeWindow === 'home' ? 'active' : ''}">
        <a href="#" on:click="{() => handleNavClick('home')}">
          <House /> Home
        </a>
      </li>
      <li class="{activeWindow === 'load' ? 'active' : ''}">
        <a href="#" on:click="{() => handleNavClick('load')}">
          <FileEarmarkPlus /> Load File
        </a>
      </li>
      <li class="{activeWindow === 'table' ? 'active' : ''} {items.length === 0 ? 'disabled' : ''}">
        <a href="#" on:click="{() => handleNavClick('table')}"> 
          <Table /> Table 
        </a>
      </li>
      <li class="{activeWindow === 'map' ? 'active' : ''}{items.length === 0 ? 'disabled' : ''}">
        <a href="#" on:click="{() => handleNavClick('map')}">
          <MapIcon /> Map
        </a>
      </li>
      <li class="{activeWindow === 'extra' ? 'active' : ''}">
        <a href="#" on:click="{() => handleNavClick('extra')}">
          <Plus /> Extra
        </a>
      </li>
      <li class="{activeWindow === 'about' ? 'active' : ''}">
        <a href="#" on:click="{() => handleNavClick('about')}">
          <QuestionCircle /> About
        </a>
      </li>
    </ul>
  </nav>
</div>
<div class="main">
  <main>
    {#if activeWindow === "home"}
      <Home activeWindow="{activeWindow}" />
    {:else if activeWindow === "load"}
      <section id="load-file">
        <h2>Load File</h2>
        <p>
          To select a file, click the button below and choose a file with the .ast extension. The file should contain
          information only from Category 10 (CAT10) and Category 21 (CAT21) data items.
        </p>
        <button class="stylish-btn" on:click="{handleLoadSomeItems}">PICK FILE</button>
        <p>Cat10 loaded items: {cat10Count}</p>
        <p>Cat21 loaded items: {cat21Count}</p>
      </section>
    {:else if activeWindow === "table"}
      <section id="table">
        <h2>Table</h2>
        <br /><br />
        <div class="button-row">
          <label for="category">Category:</label>
          <select bind:value="{selectedCategory}">
            <option value="">All</option>
            {#each categories as category}
              <option value="{category}">{category}</option>
            {/each}
          </select>

          <label for="instrument">Instrument:</label>
          <select bind:value="{selectedInstrument}">
            <option value="">All</option>
            {#each instruments as instrument}
              <option value="{instrument}">{instrument}</option>
            {/each}
          </select>
          <input type="text" bind:value="{searchTargetID}" placeholder="Enter Target ID" />

          <button type="button" class="style-button" on:click="{() => Shrink()}" disabled="{expandedItem === null}">
            Shrink
          </button>
        </div>
          <table class="mytable">
            <thead>
              <tr>
                <th>Id</th>
                <th>Class</th>
                <th>Instrument</th>
                <th>Target Id</th>
                <th>Data source identifier</th>
                <th>Message type</th>
                <th>Timestamp</th>
                <th>Position in WGS-84</th>
                <th>Position in Cartesian</th>
                <th>FL</th>
                <th>Measured Height</th>
                <th>Track Number</th>
                <th>Track Status</th>
                <th>Target Report Descriptor</th>
                <th>Calculated track velocity polar coordinates</th>
                <th>Measured Position in Polar</th>
                <th>Calculated track velocity cartesian coordinates</th>
                <th>Mode 3a in octal</th>
                <th>Amplitude of primary plot</th>
                <th>Calculated acceleration</th>
                <th>Model S data</th>
                <th>Target Size Orientation</th>
                <th>Presence</th>
                <th>Vehicle Fleet Id</th>
                <th>Pre programmed message</th>
                <th>STD position</th>
                <th>System status</th>

                <th>Aircraft operational status</th>
                <th>Service identification</th>
                <th>Service management</th>
                <th>Emitter category</th>
                <th>Time applicability position</th>
                <th>Time applicability velocity</th>
                <th>Time message reception position</th>
                <th>Time message reception position high</th>
                <th>Time message reception velocity</th>
                <th>Time message reception velocity high</th>
                <th>Time report transmission</th>
                <th>Target address</th>
                <th>Quality indicator</th>
                <th>Trajectory intent</th>
                <th>Message Amplitude</th>
                <th>Geometric Height</th>
                <th>Selected altitude</th>
                <th>Final State Selected Altitude</th>
                <th>Air speed</th>
                <th>True airspeed</th>
                <th>Magnetic heading</th>
                <th>Barometric vertical rate</th>
                <th>Geometric vertical rate</th>
                <th>Airborne ground vector</th>
                <th>Track angle rate</th>
                <th>Target ID</th>
                <th>Target status</th>
                <th>MOPS version</th>
                <th>MET info</th>
                <th>Roll angle</th>
                <th>ACAS Resolutioin Advisor Report</th>
                <th>Surface Capabilities And Characteristics</th>
                <th>Data Ages</th>
                <th>Receiver ID</th>
                <th>Pic accuracy</th>
                <th>Surface Capabilities and Characteristics age</th>
                <th>ACAS Resolution Advisory age</th>
                <th>Roll Angle age</th>
                <th>Met_Information_age</th>
                <th>Target Status age</th>
                <th>Target Identification age</th>
                <th>Track Angle Rate age</th>
                <th>Ground Vector age</th>
                <th>Geometric Vertical Rate age</th>
                <th>Barometric Vertical Rate age</th>
                <th>Magnetic Heading age</th>
                <th>True Air Speed age</th>
                <th>Air Speed age</th>
                <th>Final State Selected Altitude age</th>
                <th>Intermediate State Selected Altitude age</th>
                <th>Flight Level age</th>
                <th>Geometric Height age</th>
                <th>Message_Amplitude_age</th>
                <th>Trajectory intent age</th>
                <th>Quality Indicators age</th>
                <th>Mode 3A Code age</th>
                <th>Target Report Descriptor age</th>
                <th>Aircraft Operational Status age</th>
              </tr>
            </thead>
            <tbody>
              {#each currentPageRows as item}
                {#if item.cat === "Cat10"}
                  <tr class:smr="{item.instrument === 'SMR'}" class:mlat="{item.instrument === 'MLAT'}">
                    <td>
                      {#if item.id != null}
                        {item.id}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.cat != null}
                        {item.cat}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.instrument != null}
                        {item.instrument}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.targed_id && item.targed_id.target_identification != null}
                        {item.targed_id.target_identification}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.data_src_id != null}
                        {`SIC: ${item.data_src_id.SIC}; SAC: ${item.data_src_id.SAC}`}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.message_type != null}
                        {item.message_type}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.time_of_day != null}
                        {new Date(item.time_of_day * 1000).toISOString().substring(11, 23)}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.position_in_wgs != null}
                        {`LAT: ${item.position_in_wgs.lat.toFixed(5)}; LONG: ${item.position_in_wgs.long.toFixed(5)}`}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.position_in_cartesian != null}
                        {`X: ${item.position_in_cartesian.x}; Y: ${item.position_in_cartesian.y}`}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.flight_level != null}
                        {item.flight_level.FL}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.measured_height != null}
                        {item.measured_height}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.track_number != null}
                        {item.track_number}
                      {:else}
                        No data
                      {/if}</td
                    >

                    <td class="expandedColumn">
                      {#if item.track_status != null}
                        {#if expandedRows.includes(item)}
                          {#each Object.entries(item.track_status) as [attribute, value]}
                            <div><strong>{`-${attribute}: `}</strong>{`${value}`}</div>
                          {/each}
                        {:else}
                          <button class="style-button" on:click="{() => expandRow(item)}">Click to expand</button>
                        {/if}
                      {:else}
                        No data
                      {/if}
                    </td>

                    <td class="expandedColumn">
                      {#if item.target_report_descriptor != null}
                        {#if expandedRows.includes(item)}
                          {#each Object.entries(item.target_report_descriptor) as [attribute, value]}
                            <div><strong>{`-${attribute}: `}</strong>{`${value}`}</div>
                          {/each}
                        {:else}
                          <button class="style-button" on:click="{() => expandRow(item)}">Click to expand</button>
                        {/if}
                      {:else}
                        No data
                      {/if}
                    </td>
                    <td>
                      {#if item.calculated_track_velocity_polar_coordinates != null}
                        {`RHO: ${item.calculated_track_velocity_polar_coordinates.rho}; THETA: ${item.calculated_track_velocity_polar_coordinates.theta}`}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.measured_pos_in_polar != null}
                        {`RHO: ${item.measured_pos_in_polar.rho}; THETA: ${item.measured_pos_in_polar.theta}`}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.calculated_track_velocity_cartesian_coordinates != null}
                        {`X: ${item.calculated_track_velocity_cartesian_coordinates.x}; Y: ${item.calculated_track_velocity_cartesian_coordinates.y}`}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td class="expandedColumn">
                      {#if item.mode_3a_code_in_octal_rep != null}
                        {#if expandedRows.includes(item)}
                          {#each Object.entries(item.mode_3a_code_in_octal_rep) as [attribute, value]}
                            <div><strong>{`-${attribute}: `}</strong>{`${value}`}</div>
                          {/each}
                        {:else}
                          <button class="style-button" on:click="{() => expandRow(item)}">Click to expand</button>
                        {/if}
                      {:else}
                        No data
                      {/if}
                    </td>
                    <td>
                      {#if item.amplitude_of_primary_plot != null}
                        {item.amplitude_of_primary_plot}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.calc_acceleration != null}
                        {`X: ${item.calc_acceleration.Ax}; Y: ${item.calc_acceleration.Ay}`}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.model_s_mbdata != null}
                        {item.model_s_mbdata}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td class="expandedColumn">
                      {#if item.target_size_orientation != null}
                        {#if expandedRows.includes(item)}
                          {#each Object.entries(item.target_size_orientation) as [attribute, value]}
                            <div><strong>{`-${attribute}: `}</strong>{`${value}`}</div>
                          {/each}
                        {:else}
                          <button class="style-button" on:click="{() => expandRow(item)}">Click to expand</button>
                        {/if}
                      {:else}
                        No data
                      {/if}
                    </td>
                    <td class="expandedColumn">
                      {#if item.presence != null}
                        {#if expandedRows.includes(item)}
                          {#each item.presence as Presence}
                            <div>{`DRHO: ${Presence.DRHO}`}</div>
                            <div>{`DTHETA: ${Presence.DTHETA}`}</div>
                          {/each}
                        {:else}
                          <button class="style-button" on:click="{() => expandRow(item)}">Click to expand</button>
                        {/if}
                      {:else}
                        No data
                      {/if}
                    </td>
                    <td>
                      {#if item.vehicle_fleet_id != null}
                        {item.vehicle_fleet_id}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.pre_programmed_message != null}
                        {`TRB: ${item.pre_programmed_message.TRB}; MSG: ${item.pre_programmed_message.MSG}`}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.std_pos != null}
                        {`X: ${item.std_pos.X_component}; Y: ${item.std_pos.Y_component}; Covar: ${item.std_pos.Covar}`}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td class="expandedColumn">
                      {#if item.sys_status != null}
                        {#if expandedRows.includes(item)}
                          {#each Object.entries(item.sys_status) as [attribute, value]}
                            <div><strong>{`-${attribute}: `}</strong>{`${value}`}</div>
                          {/each}
                        {:else}
                          <button class="style-button" on:click="{() => expandRow(item)}">Click to expand</button>
                        {/if}
                      {:else}
                        No data
                      {/if}
                    </td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                  </tr>
                {:else if item.cat === "Cat21"}
                  <tr>
                    <td>
                      {#if item.id != null}
                        {item.id}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.cat != null}
                        {item.cat}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.instrument != null}
                        {item.instrument}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.target_identification != null}
                        {item.target_identification}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.data_source_identification != null}
                        {`SIC: ${item.data_source_identification.SIC}; SAC: ${item.data_source_identification.SAC}`}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>{"No data"}</td>
                    <td>
                      {#if item.time_report_transmission != null}
                        {new Date(item.time_report_transmission * 1000).toISOString().substring(11, 23)}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.wgs_84_coordinates != null}
                        {`LAT: ${item.wgs_84_coordinates.latitude.toFixed(
                          5
                        )}; LONG: ${item.wgs_84_coordinates.longitude.toFixed(5)}`}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>{"No data"}</td>
                    <td>
                      {#if item.flight_level != null}
                        {item.flight_level}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.geometric_height != null}
                        {item.geometric_height}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.track_number != null}
                        {item.track_number}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>{"No data"}</td>
                    <td class="expandedColumn">
                      {#if item.target_report_descriptor != null}
                        {#if expandedRows.includes(item)}
                          {#each Object.entries(item.target_report_descriptor) as [attribute, value]}
                            <div><strong>{`-${attribute}: `}</strong>{`${value}`}</div>
                          {/each}
                        {:else}
                          <button class="style-button" on:click="{() => expandRow(item)}">Click to expand</button>
                        {/if}
                      {:else}
                        No data
                      {/if}
                    </td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>
                      {#if item.mod_3A_code != null}
                        {item.mod_3A_code}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>
                      {#if item.mode_s_mb_data != null}
                        {item.mode_s_mb_data}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td>{"No data"}</td>
                    <td class="expandedColumn">
                      {#if item.aircraft_operational_status != null}
                        {#if expandedRows.includes(item)}
                          {#each Object.entries(item.aircraft_operational_status) as [attribute, value]}
                            <div><strong>{`-${attribute}: `}</strong>{`${value}`}</div>
                          {/each}
                        {:else}
                          <button class="style-button" on:click="{() => expandRow(item)}">Click to expand</button>
                        {/if}
                      {:else}
                        No data
                      {/if}
                    </td>
                    <td>
                      {#if item.service_identification != null}
                        {item.service_identification}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.service_management != null}
                        {item.service_management}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.emitter_category != null}
                        {item.emitter_category}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.time_applicability_position != null}
                        {new Date(item.time_applicability_position * 1000).toISOString().substring(11, 23)}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.time_applicability_velocity != null}
                        {new Date(item.time_applicability_velocity * 1000).toISOString().substring(11, 23)}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.time_message_reception_position != null}
                        {new Date(item.time_message_reception_position * 1000).toISOString().substring(11, 23)}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.time_message_reception_position_high != null}
                        {new Date(item.time_message_reception_position_high * 1000).toISOString().substring(11, 23)}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.time_message_reception_velocity != null}
                        {new Date(item.time_message_reception_velocity * 1000).toISOString().substring(11, 23)}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.time_message_reception_velocity_high != null}
                        {new Date(item.time_message_reception_velocity_high * 1000).toISOString().substring(11, 23)}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.time_report_transmission != null}
                        {new Date(item.time_report_transmission * 1000).toISOString().substring(11, 23)}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.target_address != null}
                        {item.target_address}
                      {:else}
                        No data
                      {/if}</td
                    >

                    <td class="expandedColumn">
                      {#if item.quality_indicator != null}
                        {#if expandedRows.includes(item)}
                          {#each Object.entries(item.quality_indicator) as [attribute, value]}
                            <div><strong>{`-${attribute}: `}</strong>{`${value}`}</div>
                          {/each}
                        {:else}
                          <button class="style-button" on:click="{() => expandRow(item)}">Click to expand</button>
                        {/if}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td class="expandedColumn">
                      {#if item.tarjectory_intent != null}
                        {#if expandedRows.includes(item)}
                          {#each Object.entries(item.tarjectory_intent) as [attribute, value]}
                            <div><strong>{`-${attribute}: `}</strong>{`${value}`}</div>
                          {/each}
                        {:else}
                          <button class="style-button" on:click="{() => expandRow(item)}">Click to expand</button>
                        {/if}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.message_amplitude != null}
                        {item.message_amplitude}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.geometric_height != null}
                        {item.geometric_height}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td class="expandedColumn">
                      {#if item.selected_altitude != null}
                        {#if expandedRows.includes(item)}
                          {#each Object.entries(item.selected_altitude) as [attribute, value]}
                            <div><strong>{`-${attribute}: `}</strong>{`${value}`}</div>
                          {/each}
                        {:else}
                          <button class="style-button" on:click="{() => expandRow(item)}">Click to expand</button>
                        {/if}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td class="expandedColumn">
                      {#if item.final_state_selected_altitude != null}
                        {#if expandedRows.includes(item)}
                          {#each Object.entries(item.final_state_selected_altitude) as [attribute, value]}
                            <div><strong>{`-${attribute}: `}</strong>{`${value}`}</div>
                          {/each}
                        {:else}
                          <button class="style-button" on:click="{() => expandRow(item)}">Click to expand</button>
                        {/if}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.air_speed != null}
                        {item.air_speed}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.true_airspeed != null}
                        {item.true_airspeed}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.magnetic_heading != null}
                        {item.magnetic_heading}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.barometric_vertical_rate != null}
                        {item.barometric_vertical_rate}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.geometric_vertical_rate != null}
                        {item.geometric_vertical_rate}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.geometric_vertical_rate != null}
                        {`Ground Speed: ${item.airborne_ground_vector.GroundSpeed}; Track angle: ${item.airborne_ground_vector.TrackAngle}`}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.track_angle_rate != null}
                        {item.track_angle_rate}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.target_identification != null}
                        {item.target_identification}
                      {:else}
                        No data
                      {/if}</td
                    >

                    <td class="expandedColumn">
                      {#if item.target_status != null}
                        {#if expandedRows.includes(item)}
                          {#each Object.entries(item.target_status) as [attribute, value]}
                            <div><strong>{`-${attribute}: `}</strong>{`${value}`}</div>
                          {/each}
                        {:else}
                          <button class="style-button" on:click="{() => expandRow(item)}">Click to expand</button>
                        {/if}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td class="expandedColumn">
                      {#if item.mops_version != null}
                        {#if expandedRows.includes(item)}
                          {#each Object.entries(item.mops_version) as [attribute, value]}
                            <div><strong>{`-${attribute}: `}</strong>{`${value}`}</div>
                          {/each}
                        {:else}
                          <button class="style-button" on:click="{() => expandRow(item)}">Click to expand</button>
                        {/if}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td class="expandedColumn">
                      {#if item.met_information != null}
                        {#if expandedRows.includes(item)}
                          {#each Object.entries(item.met_information) as [attribute, value]}
                            <div><strong>{`-${attribute}: `}</strong>{`${value}`}</div>
                          {/each}
                        {:else}
                          <button class="style-button" on:click="{() => expandRow(item)}">Click to expand</button>
                        {/if}
                      {:else}
                        No data met
                      {/if}</td
                    >
                    <td>
                      {#if item.roll_angle != null}
                        {item.roll_angle}
                      {:else}
                        No data roll
                      {/if}</td
                    >
                    <td class="expandedColumn">
                      {#if item.acas_resolution_advisory_report != null}
                        {#if expandedRows.includes(item)}
                          {#each Object.entries(item.acas_resolution_advisory_report) as [attribute, value]}
                            <div><strong>{`-${attribute}: `}</strong>{`${value}`}</div>
                          {/each}
                        {:else}
                          <button class="style-button" on:click="{() => expandRow(item)}">Click to expand</button>
                        {/if}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td class="expandedColumn">
                      {#if item.surface_capabilities_and_characteristics != null}
                        {#if expandedRows.includes(item)}
                          {#each Object.entries(item.surface_capabilities_and_characteristics) as [attribute, value]}
                            <div><strong>{`-${attribute}: `}</strong>{`${value}`}</div>
                          {/each}
                        {:else}
                          <button class="style-button" on:click="{() => expandRow(item)}">Click to expand</button>
                        {/if}
                      {:else}
                        No data surface
                      {/if}</td
                    >
                    <td class="expandedColumn">
                      {#if item.data_ages != null}
                        {#if expandedRows.includes(item)}
                          {#each Object.entries(item.data_ages) as [attribute, value]}
                            <div><strong>{`-${attribute}: `}</strong>{`${value}`}</div>
                          {/each}
                        {:else}
                          <button class="style-button" on:click="{() => expandRow(item)}">Click to expand</button>
                        {/if}
                      {:else}
                        No data ages
                      {/if}</td
                    >
                    <td>
                      {#if item.receiver_ID != null}
                        {item.receiver_ID}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.Pic_accuracy != null}
                        {item.Pic_accuracy}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.Surface_Capabilities_and_Characteristics_age != null}
                        {item.Surface_Capabilities_and_Characteristics_age}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.ACAS_Resolution_Advisory_age != null}
                        {item.ACAS_Resolution_Advisory_age}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.Roll_Angle_age != null}
                        {item.Roll_Angle_age}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.Met_Information_age != null}
                        {item.Met_Information_age}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.Target_Status_age != null}
                        {item.Target_Status_age}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.Target_Identification_age != null}
                        {item.Target_Identification_age}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.Track_Angle_Rate_age != null}
                        {item.Track_Angle_Rate_age}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.Ground_Vector_age != null}
                        {item.Ground_Vector_age}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.Geometric_Vertical_Rate_age != null}
                        {item.Geometric_Vertical_Rate_age}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.Barometric_Vertical_Rate_age != null}
                        {item.Barometric_Vertical_Rate_age}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.Magnetic_Heading_age != null}
                        {item.Magnetic_Heading_age}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.True_Air_Speed_age != null}
                        {item.True_Air_Speed_age}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.Air_Speed_age != null}
                        {item.Air_Speed_age}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.Final_State_Selected_Altitude_age != null}
                        {item.Final_State_Selected_Altitude_age}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.Intermediate_State_Selected_Altitude_age != null}
                        {item.Intermediate_State_Selected_Altitude_age}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.Flight_Level_age != null}
                        {item.Flight_Level_age}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.Geometric_Height_age != null}
                        {item.Geometric_Height_age}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.Message_Amplitude_age != null}
                        {item.Message_Amplitude_age}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.Trajectory_Intent_age != null}
                        {item.Trajectory_Intent_age}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.Quality_Indicators_age != null}
                        {item.Quality_Indicators_age}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.Mode_3A_Code_age != null}
                        {item.Mode_3A_Code_age}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.Target_Report_Descriptor_age != null}
                        {item.Target_Report_Descriptor_age}
                      {:else}
                        No data
                      {/if}</td
                    >
                    <td>
                      {#if item.Aircraft_Operational_Status_age != null}
                        {item.Aircraft_Operational_Status_age}
                      {:else}
                        No data
                      {/if}</td
                    >
                  </tr>
                {/if}
              {/each}
            </tbody>
          </table>
          <br /><br />
          <button type="button" class="style-button" on:click="{expandAllItems1}">Export to .csv current page</button>
          <button type="button" class="style-button" on:click="{expandAllItems2}">Export to .csv whole doc</button>
          <nav class="pagination">
            <ul>
              <li>
                <button
                  type="button"
                  class="btn-next-prev"
                  on:click="{() => setPage(page - 1)}"
                  disabled="{page === 0}"
                >
                  PREV
                </button>
              </li>

              {#if page > 1}
                <li>
                  <button type="button" class="btn-page-number" on:click="{() => setPage(0)}"> 1 </button>
                </li>
                <li><span class="ellipsis">...</span></li>
              {/if}

              {#if page > 0}
                <li>
                  <button type="button" class="btn-page-number" on:click="{() => setPage(page - 1)}">
                    {page}
                  </button>
                </li>
              {/if}

              <li><span class="current-page">{page + 1}</span></li>

              {#if page < totalPages.length - 1}
                <li>
                  <button type="button" class="btn-page-number" on:click="{() => setPage(page + 1)}">
                    {page + 2}
                  </button>
                </li>
              {/if}

              {#if page < totalPages.length - 2}
                <li><span class="ellipsis">...</span></li>
                <li>
                  <button type="button" class="btn-page-number" on:click="{() => setPage(totalPages.length - 1)}">
                    {totalPages.length}
                  </button>
                </li>
              {/if}

              <li>
                <button
                  type="button"
                  class="btn-next-prev"
                  on:click="{() => setPage(page + 1)}"
                  disabled="{page === totalPages.length - 1}"
                >
                  NEXT
                </button>
              </li>
            </ul>
          </nav>
<!--         {/if}
 -->      </section>
    {:else if activeWindow === "map"}
      <section id="map">
        <Map />
      </section>
    {:else if activeWindow === "extra"}
      <h2>Extra</h2>
    {/if}
  </main>
</div>
