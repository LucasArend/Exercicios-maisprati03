const links = document.querySelectorAll('nav a')
const content = document.getElementById('content')

const menuToggle = document.getElementById('menu-toggle');
const nav = document.querySelector('nav');

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('mostrar');
});

links.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault()

    const page = link.getAttribute('data-page')

    fetch(page)
      .then(response => {
        if (!response.ok) {
          throw new Error('Página não encontrada')
        }
        return response.text()
      })
      .then(html => {
        content.innerHTML = html

      if (page === 'hobby.html') {
          loadRandomCardsImg()
        }
      })
      
      .catch(error => {
        content.innerHTML = `<p>Erro: ${error.message}</p>`
      })
  })
})

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadRandomCardsImg() {
  const container = document.querySelector('#cartas-magic');
  const loader = document.querySelector('#loader');

  container.innerHTML = '';
  loader.style.display = 'flex';

  try {
    const cardPromises = [];

    for (let i = 0; i < 9; i++) {
      const cardPromise = fetch('https://api.scryfall.com/cards/random?q=is:fullart -layout:transform -layout:modal_dfc -layout:double_faced_token -layout:reversible_card')
        .then(res => res.json())
        .then(card => {
          const img = new Image();
          img.src = card.image_uris.normal
          img.alt = card.name;
          return new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = reject;
          });
        });

      cardPromises.push(cardPromise);
      
    }



    const [images] = await Promise.all([
      Promise.all(cardPromises),
      wait(2000)
    ]);

    images.forEach(img => container.appendChild(img));

  } catch (error) {
    console.error('Erro ao carregar cartas:', error);
    container.innerHTML = '<p>Ops, ocorreu um erro, tente novamente</p>';
  } finally {
    loader.style.display = 'none';
  }
}
