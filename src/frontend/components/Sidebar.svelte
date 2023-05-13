<script>
    import { goto } from '@sveltejs/kit/router';
    export let links = [];
  
    const handleClick = (event, link) => {
      event.preventDefault();
      link.onClick?.();
      if (link.href) {
      goto(link.href);
    }
    };
  </script>
  
  <aside>
    <ul>
      {#each links as link}
        <li>
          <a href={link.href} on:click={(event) => handleClick(event, link)}>
            {link.text}
          </a>
        </li>
      {/each}
    </ul>
  </aside>
  


  <div class="d-flex flex-column flex-shrink-0 bg-light" style="width: 4.5rem;">
    <a href="/" class="d-block p-3 link-dark text-decoration-none" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Icon-only">
      <svg class="bi" width="40" height="32"><use xlink:href="#bootstrap"></use></svg>
      <span class="visually-hidden">Icon-only</span>
    </a>
    <ul class="nav nav-pills nav-flush flex-column mb-auto text-center">
      <li class="nav-item">
        <a href="#" class="nav-link active py-3 border-bottom" aria-current="page" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Home">
          <svg class="bi" width="24" height="24" role="img" aria-label="Home"><use xlink:href="#home"></use></svg>
        </a>
      </li>
      <li>
        <a href="#" class="nav-link py-3 border-bottom" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Dashboard">
          <svg class="bi" width="24" height="24" role="img" aria-label="Dashboard"><use xlink:href="#speedometer2"></use></svg>
        </a>
      </li><li>
        <a href="#" class="nav-link py-3 border-bottom" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Orders">
          <svg class="bi" width="24" height="24" role="img" aria-label="Orders"><use xlink:href="#table"></use></svg>
        </a>
      </li>
      
      <li>
        <a href="#" class="nav-link py-3 border-bottom" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Products">
          <svg class="bi" width="24" height="24" role="img" aria-label="Products"><use xlink:href="#grid"></use></svg>
        </a>
      </li>
      <li>
        <a href="#" class="nav-link py-3 border-bottom" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Customers">
          <svg class="bi" width="24" height="24" role="img" aria-label="Customers"><use xlink:href="#people-circle"></use></svg>
        </a>
      </li>
    </ul>
  </div>
  <style>
    aside {
      display: flex;
      flex-direction: column;
      width: 200px;
      height: 100%;
      background-color: #f5f5f5;
      padding: 10px;
      box-sizing: border-box;
    }
  
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
  
    li {
      margin-bottom: 10px;
    }
  
    a {
      text-decoration: none;
      color: #333;
      display: block;
      padding: 10px;
      border-radius: 5px;
      transition: background-color 0.2s ease;
    }
  
    a:hover {
      background-color: #ddd;
    }
  </style>