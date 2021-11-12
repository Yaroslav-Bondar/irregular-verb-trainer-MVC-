class Model {
    constructor(dictionaryUrl){
        this.dictionaryUrl = dictionaryUrl;
        this.dictionary;
    }
    loadDictionary() {
        return fetch(this.dictionaryUrl)
            .then(res => res.json())
            .then(dict => dict)
            .catch(error => { throw new Error(error) } /* { return Promise.reject(error) } */);
    } 
};
class View {
    constructor() {
        this.root = document.getElementById('root');
        this.spinner = this.createElement('div', 'spinner');
        this.error = this.createElement('div', 'error');
        this.root.append(this.spinner, this.error);

    }
    loadDOM() {  //
        document.addEventListener('DOMContentLoaded', () => {
            alert("Дерево DOM готово");
            console.log("Дерево DOM готово");
        })
    }
    createElement(tag, className) {
        const element = document.createElement(tag);
        if(className) element.classList.add(className);
        return element;
    }
    showSpinner() {
        this.spinner.innerHTML = 
            `<div class="spinner__container">
                <svg width="200" height="200" version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
                <path fill="gray" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                    <animateTransform 
                    attributeName="transform" 
                    attributeType="XML" 
                    type="rotate"
                    dur="1s" 
                    from="0 50 50"
                    to="360 50 50" 
                    repeatCount="indefinite" />
                </path>
                </svg>
            <div>`;
    }
    hideSpinner() {
        this.spinner.innerHTML = '';
    }
    showError(error) {
        this.error.innerHTML = 
            `<div class="error__container">
                <div class="error__message">
                    <h3>No acces !!!</h3>
                    <h5>${error}</h5>
                    <p>please try again later</p>
                </div>
            </div>`;
    }
};
class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.loadDOM();  //
        this.onInitialLoad(this.onloadDictionary);
        console.log('finish');
    }
    openSpinner = () => {
        this.view.showSpinner();
    }
    closeSpinner = () => {
        this.view.hideSpinner();
    }
    openError = (error) => {
        this.view.showError(error);
    }
    onInitialLoad(func) {
        // alert('Open Spinner');
        console.log('Open Spinner');
        this.openSpinner();   
        alert('Open Spinner');
        func()
        .then(res => {
            console.log('initial load OK', res); 
            // alert('initial load OK');
            this.closeSpinner();
        })
        .catch(error => {
            // console.log('initial load False', error.message); 
            this.closeSpinner(); 
            this.openError(error.message);
        })
        // .then(()=> {console.log('All Ok')});
    }
    onloadDictionary = () => this.model.loadDictionary();
}

// const runApp = window.onload = function(){ new Controller(new Model('../data/data.json'), new View())};
const runApp = new Controller(new Model('../data/data.json'), new View());

// console.log('Hello');    

