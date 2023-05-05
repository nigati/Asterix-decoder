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