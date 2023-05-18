<style>
    #home {
      padding: 1em;
    }
  
    #home h2 {
      color: #226d3a;
      font-size: 2em;
      font-weight: bold;
      margin-bottom: 1em;
    }
    #home h3 {
      color: #226d3a;
      font-size: 1.5em;
      font-weight: bold;
      margin-bottom: 1em;
    }
  
    #home p {
        color: #226d3a;

      font-size: 1.1em;
      line-height: 1.5;
      margin-bottom: 1em;
    }
  
    #home ul {
      font-size: 1.1em;
      margin-bottom: 1em;
      color: #226d3a;

    }
  #home button {
    padding: 0.5em 1em;
    font-size: 1em;
    background-color: #226d3a;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
    #home ul li {
      margin-bottom: 0.5em;
      color: #226d3a;
    }
  
    #home ul li strong {
      font-weight: bold;
      color: #226d3a;
    }
  
    #home p:last-child {
      margin-bottom: 0;
      color: #226d3a;
    }
  </style>
  
  <script>
    export let activeWindow;
    let showTeamMembers=false;
  </script>
<!-- Home section -->
<section id="home" class="{activeWindow === 'home' ? 'active' : ''}">
    <h2>Welcome to the Asterix Decoder</h2>
    <p>
      The Asterix Decoder is a program designed to decode Asterix protocol data. It allows you to analyze and interpret
      information from various sources using the Asterix standard.
    </p>
    <p>
      This program provides the following pages for your analysis and exploration:
    </p>
    <ul>
      <li><strong>Home:</strong> This welcoming page that provides an overview and explains the program's navigation.</li>
      <li><strong>Load File:</strong> Load an Asterix data file for decoding and analysis.</li>
      <li><strong>Table:</strong> View the decoded Asterix data in a table format.</li>
      <li><strong>Map:</strong> Visualize the decoded data on a map.</li>
      <li><strong>Extra:</strong> Additional features and tools for further analysis.</li>
    </ul>
    <p>
      To navigate between these pages, use the sidebar on the left. Simply click on the respective item to switch to that
      page. The active page will be highlighted in the sidebar.
    </p>
    {#if showTeamMembers}
    <h3>Our Team Members:</h3>
    <ul>
      <li>Daniel Carneros Mateu</li>
      <li>Pablo Carreras Escudero</li>
      <li>José Ramón Iniesta Expósito</li>
      <li>Hatim Benallal Benallal</li>
      <li>Nicolai Galici-Tiscenco</li>
    </ul>
    {:else}
    <button class="show-team-button" on:click="{() => showTeamMembers = true}">
      Show Team Members
    </button>
  {/if}
  </section>