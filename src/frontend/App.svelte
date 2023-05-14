<style>
  main {
    text-align: center;
    padding: 1em;
    margin-left: 220px; /* sidebar width + 2x padding */
    padding: 20px;
    max-width: 1200px; /* Add 'px' to specify the unit */
    margin: 0 auto;
  }

  .expandedColumn {
    width: 400px; /* Adjust the width to your desired value */
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
    border-bottom: 1px solid black; /* Add a bottom border to table headers */
    border-right: 1px solid black; /* Add a right border to table headers */
  }
  td {
    color: black;
    font-size: small;
    text-align: left;
    padding: 8px;
    width: max-content;
    border-bottom: 1px solid black; /* Add a bottom border to table cells */
    border-right: 1px solid black; /* Add a right border to table cells */
  }
  tr.smr {
    background-color: grey;
  }

  tr.mlat {
    background-color: lightblue;
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
  import type { Cat10 } from "./models/cat10";
  import type { Cat21 } from "./models/cat21";
  import { initIpcMain, ipcMainBi, parseIpcMainReceiveMessage } from "./ipcMain";
  import Map from './Map.svelte';
  

  let items: (Cat10 | Cat21)[] = [];
  let items_len = 0;
  let page = 0;
  let totalPages: (Cat10 | Cat21)[][] = [];
  let currentPageRows: (Cat10 | Cat21)[] = [];
  let itemsPerPage = 100;

  let loading = false;

  let expandedRows: (Cat10 | Cat21)[] = [];
  let expandedItem: Cat10 | Cat21;
  $: currentPageRows = totalPages.length > 0 ? totalPages[page] : [];
  $: console.log("Page is", page);

  const paginate = (items: (Cat10 | Cat21)[]) => {
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
    const FRAGMENTS = 1000;
    let i = 0;
    await ipcMainBi("load-items", 1000);
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
  function expandRow(item: Cat10 | Cat21) {
    expandedItem = item;
  }
  function toggleRow(item: Cat10 | Cat21) {
    if (expandedRows.includes(item)) {
      expandedRows = expandedRows.filter((row) => row !== item);
    } else {
      expandedRows.push(item);
    }
  }

  function htmlToCsv(filename: any) {
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
</script>

    
<main>
  <h1>ASTERIX DECODER</h1>
  <button type="button" class="btn btn-primary" on:click="{handleLoadSomeItems}">PICK FILE</button>
  <br /><br />
  <table>
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
        <!-- {@debug currentPageRows}
        {@debug item} -->
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
                {#if expandedItem === item}
                  {#each Object.entries(item.track_status) as [attribute, value]}
                    <div>{`${attribute}: ${value}`}</div>
                  {/each}
                {:else}
                  <button on:click="{() => expandRow(item)}">Click to expand</button>
                {/if}
              {:else}
                No data
              {/if}
            </td>

            <td class="expandedColumn">
              {#if item.target_report_descriptor != null}
                {#if expandedItem === item}
                  {#each Object.entries(item.target_report_descriptor) as [attribute, value]}
                    <div>{`${attribute}: ${value}`}</div>
                  {/each}
                {:else}
                  <button on:click="{() => expandRow(item)}">Click to expand</button>
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
                {#if expandedItem === item}
                  {#each Object.entries(item.mode_3a_code_in_octal_rep) as [attribute, value]}
                    <div>{`${attribute}: ${value}`}</div>
                  {/each}
                {:else}
                  <button on:click="{() => expandRow(item)}">Click to expand</button>
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
                {#if expandedItem === item}
                  {#each Object.entries(item.target_size_orientation) as [attribute, value]}
                    <div>{`${attribute}: ${value}`}</div>
                  {/each}
                {:else}
                  <button on:click="{() => expandRow(item)}">Click to expand</button>
                {/if}
              {:else}
                No data
              {/if}
            </td>
            <td class="expandedColumn">
              {#if item.presence != null}
                {#if expandedItem === item}
                  {#each item.presence as Presence}
                    <div>{`DRHO: ${Presence.DRHO}`}</div>
                    <div>{`DTHETA: ${Presence.DTHETA}`}</div>
                  {/each}
                {:else}
                  <button on:click="{() => expandRow(item)}">Click to expand</button>
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
                {#if expandedItem === item}
                  {#each Object.entries(item.sys_status) as [attribute, value]}
                    <div>{`${attribute}: ${value}`}</div>
                  {/each}
                {:else}
                  <button on:click="{() => expandRow(item)}">Click to expand</button>
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
          <tr on:click="{() => toggleRow(item)}">
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
                {`LAT: ${item.wgs_84_coordinates.latitude.toFixed(5)}; LONG: ${item.wgs_84_coordinates.longitude.toFixed(5)}`}
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
              {#if expandedItem === item}
                {#each Object.entries(item.target_report_descriptor) as [attribute, value]}
                  <div>{`${attribute}: ${value}`}</div>
                {/each}
              {:else}
                <button on:click="{() => expandRow(item)}">Click to expand</button>
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
              {#if expandedItem === item}
                {#each Object.entries(item.aircraft_operational_status) as [attribute, value]}
                  <div>{`${attribute}: ${value}`}</div>
                {/each}
              {:else}
                <button on:click="{() => expandRow(item)}">Click to expand</button>
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
                {item.time_applicability_position}
              {:else}
                No data
              {/if}</td
            >
            <td>
              {#if item.time_applicability_velocity != null}
                {item.time_applicability_velocity}
              {:else}
                No data
              {/if}</td
            >
            <td>
              {#if item.time_message_reception_position != null}
                {item.time_message_reception_position}
              {:else}
                No data
              {/if}</td
            >
            <td>
              {#if item.time_message_reception_position_high != null}
                {item.time_message_reception_position_high}
              {:else}
                No data
              {/if}</td
            >
            <td>
              {#if item.time_message_reception_velocity != null}
                {item.time_message_reception_velocity}
              {:else}
                No data
              {/if}</td
            >
            <td>
              {#if item.time_message_reception_velocity_high != null}
                {item.time_message_reception_velocity_high}
              {:else}
                No data
              {/if}</td
            >
            <td>
              {#if item.time_report_transmission != null}
                {item.time_report_transmission}
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
              {#if expandedItem === item}
                {#each Object.entries(item.quality_indicator) as [attribute, value]}
                  <div>{`${attribute}: ${value}`}</div>
                {/each}
              {:else}
                <button on:click="{() => expandRow(item)}">Click to expand</button>
              {/if}
              {:else}
              No data
            {/if}</td
          >
            <td class="expandedColumn">
              {#if item.tarjectory_intent != null}
              {#if expandedItem === item}
                {#each Object.entries(item.tarjectory_intent) as [attribute, value]}
                  <div>{`${attribute}: ${value}`}</div>
                {/each}
              {:else}
                <button on:click="{() => expandRow(item)}">Click to expand</button>
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
              {#if expandedItem === item}
                {#each Object.entries(item.selected_altitude) as [attribute, value]}
                  <div>{`${attribute}: ${value}`}</div>
                {/each}
              {:else}
                <button on:click="{() => expandRow(item)}">Click to expand</button>
              {/if}
              {:else}
              No data
            {/if}</td
          >
            <td class="expandedColumn">
              {#if item.final_state_selected_altitude != null}
              {#if expandedItem === item}
                {#each Object.entries(item.final_state_selected_altitude) as [attribute, value]}
                  <div>{`${attribute}: ${value}`}</div>
                {/each}
              {:else}
                <button on:click="{() => expandRow(item)}">Click to expand</button>
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
              {#if expandedItem === item}
                {#each Object.entries(item.target_status) as [attribute, value]}
                  <div>{`${attribute}: ${value}`}</div>
                {/each}
              {:else}
                <button on:click="{() => expandRow(item)}">Click to expand</button>
              {/if}
              {:else}
              No data
            {/if}</td
          >
            <td class="expandedColumn">
              {#if item.mops_version != null}
              {#if expandedItem === item}
                {#each Object.entries(item.mops_version) as [attribute, value]}
                  <div>{`${attribute}: ${value}`}</div>
                {/each}
              {:else}
                <button on:click="{() => expandRow(item)}">Click to expand</button>
              {/if}
              {:else}
              No data
            {/if}</td
          >
          <td class="expandedColumn">
            {#if item.met_information != null}
            {#if expandedItem === item}
              {#each Object.entries(item.met_information) as [attribute, value]}
                <div>{`${attribute}: ${value}`}</div>
              {/each}
            {:else}
              <button on:click="{() => expandRow(item)}">Click to expand</button>
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
              {#if expandedItem === item}
                {#each Object.entries(item.acas_resolution_advisory_report) as [attribute, value]}
                  <div>{`${attribute}: ${value}`}</div>
                {/each}
              {:else}
                <button on:click="{() => expandRow(item)}">Click to expand</button>
              {/if}
              {:else}
              No data
            {/if}</td
          >
            <td class="expandedColumn">
              {#if item.surface_capabilities_and_characteristics != null}
              {#if expandedItem === item}
                {#each Object.entries(item.surface_capabilities_and_characteristics) as [attribute, value]}
                  <div>{`${attribute}: ${value}`}</div>
                {/each}
              {:else}
                <button on:click="{() => expandRow(item)}">Click to expand</button>
              {/if}
              {:else}
              No data surface
            {/if}</td
          >
            <td class="expandedColumn">
              {#if item.data_ages != null}
              {#if expandedItem === item}
                {#each Object.entries(item.data_ages) as [attribute, value]}
                  <div>{`${attribute}: ${value}`}</div>
                {/each}
              {:else}
                <button on:click="{() => expandRow(item)}">Click to expand</button>
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
  <button type="button" on:click="{htmlToCsv}">Export to .csv</button>

  <nav class="pagination">
    <ul>
      <li>
        <button type="button" class="btn-next-prev" on:click="{() => setPage(page - 1)}" disabled="{page === 0}">
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
  <Map />
  
  
</main>
