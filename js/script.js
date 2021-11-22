class Model {
    constructor(verbsUrl) {
        this.verbsUrl = verbsUrl;
        // this.verbs;
        // this.randomVerb;
        // this.randomForm;  // ? 
        // this.nativeVerb;
        this.checkInputReg = /^\s*[a-z]+\s*$/i;
    }
    get MAX_VERB_INDEX() {
        return 3;
    }
    set MAX_VERB_INDEX(value) {
        throw new Error('MAX_VERB_INDEX is immutable');
    }
    loadVerbs() {
        return fetch(this.verbsUrl)
            .then(res => res.json())
            .then(verbs => this.verbs = verbs)
            .catch(error => { throw new Error(error) } /* { return Promise.reject(error) } */);
    }
    getRandomNumber = max => Math.floor(Math.random() * max);
    setRandomVerbData() {
        let randomVerbPack = this.verbs[this.getRandomNumber(this.verbs.length)];
        this.randomVerb = randomVerbPack.filter((item, index) => {
            return index < this.MAX_VERB_INDEX;
        });
        this.randomForm = this.getRandomNumber(this.MAX_VERB_INDEX);
        this.nativeVerb = randomVerbPack[this.MAX_VERB_INDEX];
    }
    checkAnswer(answer) {
        let checkInput, checkAnswer;
        checkInput = this.checkInputReg.test(answer) ? true : false;
        checkAnswer = new RegExp(`\\b${answer.trim()}\\b`, 'i').test(this.randomVerb[this.randomForm]) ? true : false;
        return checkInput && checkAnswer ? true : false;
    }
};
class View {
    constructor() {
        document.addEventListener('DOMContentLoaded', () => {
            alert("Дерево DOM готово View");
            console.log("Дерево DOM готово View");
        });
        this.root = document.getElementById('root');
        this.spinner = this.createElement('div', 'spinner');
        this.error = this.createElement('div', 'error');
        this.root.append(this.spinner, this.error);
        this.form = this.createElement('form', 'form');
        this.input = this.createElement('input', 'form__input');
        this.input.type = 'text';
        this.form.append(...this._createCloneElements(this.input, 3));
        this.answer = this.createElement('div', 'answer');

        this.inputs;
        
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
    loadUI() {
            this.root.append(this.form, this.answer);
            this.inputs = this.root.getElementsByClassName('form__input');
    }
    loadDOM() {  //
        return new Promise((resolve, reject) => {
            document.addEventListener('DOMContentLoaded', () => {
                alert("Дерево DOM готово");
                console.log("Дерево DOM готово");
            });
            return resolve([1]);
        });
    }
    _createCloneElements(element, amount) {
        let elements = [];
        while(amount--) elements.push(element.cloneNode(true));
        return elements;
    }
    createElement(tag, className) {
        const element = document.createElement(tag);
        if(className) element.classList.add(className);
        return element;
    }
    displayVerbs(verbs, form) {
        verbs.forEach((item, index) => {
            if(index !== form) {
                this.inputs[index].value = item;
                this.inputs[index].disabled = true;
            }
            else {  
                this.inputs[form].value = '';
                this.inputs[form].disabled = false;
                this.inputs[form].focus();
            }
        });
    }
    bindEditVerb(handler) {
        this.form.addEventListener('change', event => {
            if(event.target.className === 'form__input') {
                handler(event.target.value);
            }
        });
    }
    displayAnswer(verbs, form) {
        this.answer.innerHTML = verbs[form];
        this.answer.classList.add('answer__show');
        this.inputs[form].disabled = true;  // *
    }
    confirmAnswer(form) {
        // console.log(form);
        // console.log(this.input);
        this.inputs[form].classList.add('form__input_confirmed');
        this.inputs[form].disabled = true;  // *
        // this.answer.classList.add('answer__show');
    }
    resetSignals() {
        return new Promise(resolve => {
            setTimeout(()=> {
                this.answer.innerHTML = '';
                this.answer.classList.remove('answer__show');
                for (const input of this.inputs) {
                    if(input.classList.contains('form__input_confirmed'))
                        input.classList.remove('form__input_confirmed');
                }
                return resolve();
            }, 3000);
        });
    }
};
class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        alert('ddd')
        this.onInitialLoad(this.onLoadVerbs)
        .finally(() => this.offSpinner())
        .then(() => {
            this.onLoadUI();
            this.onSetRandomVerbData();
            this.onDisplayVerbs(this.model.randomVerb, this.model.randomForm);
            // this.onDisplayAnswer(this.model.randomVerb, this.model.randomForm);
            this.view.bindEditVerb(this.bindHandleEditVerb);
            
            // this.model.verbs = verbs;
            // console.log('verbs = ', this.model.verbs);
            // console.log(this.model.verbs[this.model.getRandomNumber(4)]);
        })
        .catch(error => {
            console.log('initial load False', error.stack); 
            this.onError(error.message);
        });
        console.log('finish');
    }
    // 
    async handleEditVerb(answer) {
        // console.log('checkAnswer', this.model.checkAnswer(answer));
        if(this.model.checkAnswer(answer)) {
            this.onConfirmAnswer(this.model.randomForm);
        }
        else {
            this.onDisplayAnswer(this.model.randomVerb, this.model.randomForm);
        }
        //  
        await this.view.resetSignals();
        // setTimeout(()=> {this.view.resetSignals()}, 2000);
        this.onSetRandomVerbData();
        this.onDisplayVerbs(this.model.randomVerb, this.model.randomForm);
    };
    bindHandleEditVerb = this.handleEditVerb.bind(this);
    onInitialLoad(task1) {
        // alert('Open Spinner');
        console.log('Open Spinner');
        this.onSpinner();   
        alert('spinner opened');
        // alert('Open Spinner');
        // , task2()
        return Promise.all([task1()])
        .then(verbs => {
            console.log('initial load OK', verbs); 
            // alert('initial load OK');
            // return verbs[0];
        })
        .catch(error => {
            throw error;
        })
    }
    onSpinner = () => {
        this.view.showSpinner();
    }
    offSpinner = () => {
        this.view.hideSpinner();
    }
    onError = error => {
        this.view.showError(error);
    }
    onLoadVerbs = () => this.model.loadVerbs();
    onLoadUI = () => this.view.loadUI();
    onSetRandomVerbData = () => this.model.setRandomVerbData();
    onDisplayVerbs = (verb, form) => this.view.displayVerbs(verb, form);
    onDisplayAnswer = (verb, form) => this.view.displayAnswer(verb, form);
    onConfirmAnswer = form => this.view.confirmAnswer(form);
    // bindEditTodo
}

// const runApp = window.onload = function(){ new Controller(new Model('../data/data.json'), new View())};
const runApp = new Controller(new Model('../data/data.json'), new View());

// console.log('Hello');    

