const apiKey = 'e94a68aeda80448fb69bd7c5b6ea2aa3';
const defaultCategory = 'general';
const defaultSource = 'google-news-in';
const categorySelector = document.querySelector('#category');
const sourceSelector = document.querySelector('#sources');
const newsArticles = document.querySelector('main');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('sw.js')
      .then(registration => console.log('Service Worker registered'))
      .catch(err => 'SW registration failed'));
}

window.addEventListener('load', e => {
  sourceSelector.addEventListener('change', evt => updateNews(evt.target.value));
  categorySelector.addEventListener('change', ()=> updateNewsSources());
  updateNewsSources().then(() => {
    sourceSelector.value = defaultSource;
    updateNews();
  });
});

window.addEventListener('online', () => updateNews(sourceSelector.value));

async function updateNewsSources() {
  const response = await fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`);
  const json = await response.json();
  sourceSelector.innerHTML =
    json.sources
      .map(source => {
        if(source.category == categorySelector.value){
          return `<option value="${source.id}">${source.name}</option>`
        }
      })
      .join('\n');
}

async function updateNews(source = defaultSource) {
  newsArticles.innerHTML = '';
  const response = await fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&sortBy=top&apiKey=${apiKey}`);
  const json = await response.json();
  newsArticles.innerHTML =
    json.articles.map(createArticle).join('\n');
}

function createArticle(article) {
  return `
    <div class="article">
      <a href="${article.url}">
        <h3>${article.title}</h3>
        <img src="${article.urlToImage}" alt="${article.title}">
        <p>${article.description}</p>
      </a>
    </div>
  `;
}
