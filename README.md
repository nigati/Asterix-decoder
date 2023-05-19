<div align="center">
<h1 align="center">ASTERIX Message decoder</h1>
<h4 align="center">This program is used to decode .ast files as well as visualize and analyze the Cat10 (SMR and MLAT) and Cat21 (ADS-B) items.</h4>
</div>

<h2>Windows Insaller <a>Download Link</a>!</h2>
</div>
<details>
  <summary><h3>Introduction</h3></summary>
  <p align="justify">The ASTERIX protocol is an ATM surveillance data binary messaging format used for exchanging information between surveillance and automation systems. It is designed to optimize data transmission with limited bandwidth while preserving all necessary information. The software decodes Cat 10 for SMR and MLAT (Surface Movement Radar and Multilateration) and Cat 21 for ADS-B (Automatic Dependent Surveillance-Broadcast). It enables the analysis of real traffic on the airport surface, including approximate positions, takeoffs, and ADS-B trajectories during surface operations and in-flight. SMR detects and locates targets in airport maneuvering and parking areas, while MLAT uses multiple receivers to triangulate the position of aircraft or ground vehicles. ADS-B relies on aircraft-supplied data, including flight identification, position, and other relevant parameters obtained from onboard systems. </p>
</details>

<details>
  <summary><h3>Structure</h3></summary>

  <h4>General Structure </h4>

<p align="justify">This application utilizes web technologies such as JavaScript (including TypeScript), HTML, and CSS. It is built on the Electron framework, which provides two main threads: Main and Renderer. These threads resemble a server-client relationship, where the Renderer acts as the web client and the Main thread serves as the server. Inter-process communication (IPC) facilitates communication between the two threads, functioning as a fast HTTP-based information exchange. The application offloads heavy calculations, such as file decoding, writing, and performance parameter calculations, to separate processes called Workers. The Main thread includes the main file (index.ts) responsible for launching the application and managing the Renderer thread. Additionally, various IPC-triggered functions are executed in response to events sent by the Renderer, such as opening a file or retrieving the first 10000 messages from a list.</p>


- loadFileIpc: open the file picker and load a file.

- block_slicer: slice a whole file Buffer into buffers containing individual messages.

- getMessagesIpcWorker: decodes the messages using a worker.

- getMessagesIpcSlices: sends 10000 decoded messages.

- writeKmlFile: Write a kml file in a separate Worker.

<p align="justify">Within the Renderer thread, the application is organized into files that describe the rendered objects and pages (with the .svelte extension) as well as scripts (with the .ts extension) that handle the logic for the Map and Simulation. The primary Svelte files include App.svelte, which defines the general structure and Map component, ExpandableTable.svelte for the table view, and Parameters.svelte for the performance parameters view. On the script side, map.ts is responsible for initializing the map, graphicsLayer.ts manages the logic for 3D objects and layer management, groundLayer.ts handles ground markers and layer management, and areaLayer.ts defines ground areas. Additionally, Simulation.svelte is responsible for the simulation logic and rendering associated controls. Some of the workload is offloaded to Web Workers to ensure smoother operation and prevent blocking the main thread during computationally intensive tasks.</p>

  <h4>
Used software and libraries</h4>

The Web Application utilizes several libraries, including:

·ElectronJS: Enables the creation of cross-platform desktop applications using web technologies.
·Typescript: Adds type safety to JavaScript, enhancing the developer experience.
·Svelte.js: A frontend compiler that offers a reactive DOM and improved performance for building dynamic web applications.
·ArcGIS API for JavaScript: A lightweight and powerful library for embedding maps and visualizing data in web applications.
·Bootstrap 5: A CSS framework that provides a range of UI components, such as buttons, menus, and sliders.

In addition, other libraries used include Geolib for coordinate conversion and geometric operations, GeoJSON for quick conversion to KML, and Array-search for efficient searches.


<details>
  <summary><h3>How to</h3></summary>
  <h5>Installation</h5>
  <p>Download the <a href="https://github.com/PauBaguer/asterix-visualizer/releases/tag/0.1.0" >executable</a> for Windows</p>
  <h5>First steps</h5>
  <p align="justify">On the home page you can visualize some of the usage tips of the program and the team members.</p>
  <p align="justify">To begin, one has to load a file using the Load File menu. Pressing the button will open a prompt to select a file. Files must have .ast extension</p>
    <br>
<h5>Explore the table</h5>
  <p align="justify">The Web Application provides a range of information through the data items of the messages. Here are some of the capabilities it offers:</p>
<p align="justify">
Filter by category, system, and message type: You can apply filters to view messages based on their category, system, or message type. This allows you to focus on specific subsets of data.
</p>
<p align="justify">
Access to detailed information: Some data items have additional information. You can click the button to expand a row and visualize extra information.
</p>
  <h5>Map and simulation</h5>
  <p align="justify">The simulation controls in the Web Application provide various functionalities:

-Start, stop, and restart the simulation: Allows you to control the execution of the simulation.
-Move forwards and backwards: Enables navigation through different time points in the simulation.
-Change the speed of the simulation time: Adjusts the playback speed of the simulation.
-Choose the type of traffic to display: Allows you to select the specific type of traffic (e.g., airplanes) you want to see in the simulation.
-Click on airplane paths for information: By clicking on the path of an airplane, you can access the main information contained in its message at that particular moment.</p>
These simulation controls give users the ability to interact with the application, customize their viewing experience, and access detailed information about individual airplanes. Additionally, the option to view the airplanes in 3D enhances the visual representation of the simulation.

  <h5>Export data to csv...</h5>
    <div align="center">
  <img src="https://github.com/PauBaguer/asterix-visualizer/blob/master/assets/DataCsv.gif" width = 80%>
  </div>
  <h5>Export routes to kml...</h5>
    <div align="center">
  <img src="https://github.com/PauBaguer/asterix-visualizer/blob/master/assets/DataKml.gif" width = 80%>
  
<h5>Other extras</h5>
    <p align="justify">
    - Data Item I021/090 Quality Indicators decodification
    </p>

</details>


<h3> Team members</h3>

- Daniel Carneros Mateu</li>
- Pablo Carreras Escudero</li>
- José Ramón Iniesta Expósito</li>
- Hatim Benallal Benallal</li>
- Nicolai Galici-Tiscenco</li>

