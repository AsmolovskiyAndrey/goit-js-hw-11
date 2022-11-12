import './css/styles.css';
import Notiflix from 'notiflix';


const formRef = document.querySelector('.search-form')
const cardRef = document.querySelector('.gallery')


const URL = 'https://pixabay.com/api/?key=31273147-56325c5e652f187dddce9fa62'
let ourObject = ''
let bigObj = []

formRef.addEventListener('input', getInfo)
formRef.addEventListener('submit', submitInfo)



function getInfo(event) {
    // console.log(event.target.value);
    ourObject = `q=${event.target.value.trim()}&image_type=photo&orientation=horizontal&safesearch=true`;
}

function submitInfo(event) {
    event.preventDefault()
    // console.log(ourObject);
    fetchCard()
        .then(data => {
            if (data.total >= 1) {
                makeCard(data)
            } else {
                noPages()
            }
        })
}

function fetchCard() {
    return fetch(`${URL}&${ourObject}`)
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
        <div class="photo-card">
                <img class="gallery__image" src="${value.webformatURL}"
                alt="${value.tags}" 
                width = "280"
                loading="lazy" />
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
                cardRef.innerHTML = markup;
}

function noPages() {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    // document.querySelector('.country-list').innerHTML = "";
}