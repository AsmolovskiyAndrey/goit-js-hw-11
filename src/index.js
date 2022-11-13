import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import "simplelightbox/dist/simple-lightbox.min.css";


const formRef = document.querySelector('.search-form')
const cardRef = document.querySelector('.gallery')
const loadMoreRef = document.querySelector('.load-more')


const URL = 'https://pixabay.com/api/?key=31273147-56325c5e652f187dddce9fa62'
let ourObject = ''
let lightbox = new SimpleLightbox('.gallery a');
let page = 1;

formRef.addEventListener('input', getInfo)
formRef.addEventListener('submit', submitInfo)
cardRef.addEventListener('click', onClick);
loadMoreRef.addEventListener('click', loadMore);

function onClick(evt) { //? отмена действий от браузера по умолчанию
    evt.preventDefault();
}

function loadMore() {
    page += 1;
    fetchCard().then(data => {
        console.log(data.hits.length);
        makeCard(data)
    })
}

function getInfo(event) {
    ourObject = `q=${event.target.value.trim()}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`;
}

function submitInfo(event) {
    event.preventDefault()
    // console.log(ourObject);
    fetchCard()
        .then(data => {
            console.log(data);
            if (data.total >= 1) {
                makeCard(data)
            } else {
                noPages()
            }
        })
}

function fetchCard() {
    return fetch(`${URL}&${ourObject}&page=${page}`)
        .then(responce => {
            if (!responce.ok) {
                throw new Error(responce.statusText);
                }
            return responce.json();
            });
}

function makeCard(data) {
    console.log(data);
    let markup = (data.hits).map(value => `
        <div class="gallery photo-card">
                <a href = "${value.largeImageURL}">
                    <img class="small_image" src="${value.webformatURL}" alt="${value.tags}" loading="lazy" />
                </a>
            <div class="info">
                <p class="info-item">
                    <b>Likes</b><br>
                    ${value.likes}
                </p>
                <p class="info-item">
                    <b>Views</b><br>
                    ${value.views}
                </p>
                <p class="info-item">
                    <b>Comments</b><br>
                    ${value.comments}
                </p>
                <p class="info-item">
                    <b>Downloads</b><br>
                    ${value.downloads}
                </p>
            </div>
        </div>
            `).join('')
                cardRef.insertAdjacentHTML('beforeend', markup);
}

function noPages() {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    // document.querySelector('.country-list').innerHTML = "";
}