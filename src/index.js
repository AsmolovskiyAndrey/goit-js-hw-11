import './css/styles.css';


let formRef = document.querySelector('.search-form')

formRef.addEventListener('input', getInfo)
formRef.addEventListener('submit',submitInfo)

function getInfo(event) {
    console.log(event.target.value);
}

function submitInfo(event) {
    event.preventDefault()
    console.log('qwe');
}