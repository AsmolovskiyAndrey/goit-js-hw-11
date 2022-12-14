import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import "simplelightbox/dist/simple-lightbox.min.css";


const formRef = document.querySelector('.search-form')
const cardRef = document.querySelector('.gallery')
const startRef = document.querySelector('.start')


const URL = 'https://pixabay.com/api/?key=31273147-56325c5e652f187dddce9fa62'
let fullKey = ''
let lightbox = new SimpleLightbox('.gallery a');
let page = 1;

formRef.addEventListener('input', getInfo)
formRef.addEventListener('submit', submitInfo)
cardRef.addEventListener('click', onClick);
startRef.addEventListener('click', goToStart);

function onClick(evt) { //? отмена действий от браузера по умолчанию
    evt.preventDefault();
}

function loadMore() {
    startRef.classList.add("hidden");
    page += 1;
    fetchCard().then(data => {
        if (data.hits.length > 0) {
            makeCard(data)
        }
        else {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            return
        }
    })
}

function getInfo(event) {
    fullKey = `q=${event.target.value.trim()}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`;
}

function submitInfo(event) {
    event.preventDefault()
    page = 1
    cardRef.innerHTML = "";
    const nullValue = "q=&image_type=photo&orientation=horizontal&safesearch=true&per_page=40"

    if (fullKey === nullValue || fullKey === "") {
        emptyValue()
        return
    }

    fetchCard()
        .then(data => {
            if (data.total >= 1) {
                makeCard(data)
                Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
            } else {
                noPages()
            }
        })
}

async function fetchCard() {
    const dataResponce = await axios.get(`${URL}&${fullKey}&page=${page}`)
    return dataResponce.data
}

function makeCard(data) {
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
    cardRef.innerHTML = "";
}

function emptyValue() {
    Notiflix.Notify.warning('you must enter at least one letter.');
    cardRef.innerHTML = "";
}

function goToStart() {
    window.scrollTo({ //! плавный скрол вверх
        top: 0,
        left: 0,
        behavior: "smooth",
    })
    startRef.classList.remove("hidden");
}

window.addEventListener('scroll',()=> { //! бесконечный скролл
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement

    if (scrollTop >= scrollHeight - clientHeight - 0.5) {
        loadMore()
    }
})