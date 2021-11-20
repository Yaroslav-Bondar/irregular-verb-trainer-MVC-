class Model {
    constructor(verbsUrl){
        this.verbsUrl = verbsUrl;
        this.verbs;
        this.randomVerb;
        this.randomForm;
        this.checkInputReg = /^\s*[a-z]+\s*$/i;
        // this.checkAnswerReg = `\\b${answer.trim()}\\b`; // * get answer from view checkAnswer

        // this.answer;
        // console.log(this.verbs[this.getRandomNumber(4)]);
    }
    loadVerbs() {
        return fetch(this.verbsUrl)
            .then(res => res.json())
            .then(verbs => verbs)
            .catch(error => { throw new Error(error) } /* { return Promise.reject(error) } */);
    }
    setVerbs(verbs) {
        this.verbs = verbs;
    }
    getRandomNumber = max => Math.floor(Math.random() * max);

    setRandomVerb() {
        this.randomVerb = this.verbs[this.getRandomNumber(this.verbs.length)];
    }
    setRandomForm() {
        this.randomForm = this.getRandomNumber(3);
    }
    // setAnswer() {
    //     this.answer = this.randomVerb[this.randomForm];
    // }
    setRandomVerbForm() {
        this.setRandomVerb();
        this.setRandomForm();
        // this.setAnswer();
    }
    checkAnswer(answer) {
        // if() /* ^\s*\bwere\b\s*$ */
        // let regValid = /^\s*\b[a-z]+\b\s*$/i;
        // let regVerb = new RegExp(`\\b${answer.trim()}\\b`, 'i');
        let checkInput, checkAnswer;
        if(this.checkInputReg.test(answer)) {  // go out reg exp !
            console.log('valid', true);
            checkInput = true;
        }
        else {
            console.log('valid', false);
            checkInput = false;
        }

        if(new RegExp(`\\b${answer.trim()}\\b`, 'i').test(this.randomVerb[this.randomForm])) {
            console.log('verb', true);
            checkAnswer = true;
        }
        else {
            console.log('verb', false);
            checkAnswer = false;
        }
        return checkInput && checkAnswer ? true : false;
        // let answer = 'wer';
        // let reg = /^\s*\b[a-z]*\b\s*$/i;
        // let reg2 = new RegExp(`${answer}`, 'i');
        // let verb = 'was/were';
        
        // console.log(reg.test(answer));
        // console.log(reg2.test(verb));
    }
};
class View {
    constructor() {
        document.addEventListener('DOMContentLoaded', () => {
            alert("Дерево DOM готово View");
            console.log("Дерево DOM готово View");
            // resolve();
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
        // await async
        // return new Promise(resolve => {
            // function startRenderView () {
            this.root.append(this.form, this.answer);
            this.inputs = this.root.getElementsByClassName('form__input');
            // };
            // resolve({task: 'load_UI', status: true});
        // })
        // .then(res => res, error => error);
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
            if(index < 3) {
                if(index !== form) {
                    this.inputs[index].value = item;
                    this.inputs[index].disabled = true;
                }
                // && this.inputs[index].value
                if(index === form) {  // * without index
                    this.inputs[index].value = '';
                    this.inputs[form].disabled = false;
                    this.inputs[form].focus();
                }
            }
        });
    }
    bindEditVerb(handler) {
        // console.log(this.form);
        this.form.addEventListener('change', event => {
            // console.log(event);
            if(event.target.className === 'form__input') {
                // console.log('I am handler ', event.target.value);
                // handler(event.target.value);
                // handler.call(runApp, event.target.value);  // * call: it must knows the runApp
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
        // this.view.loadDOM();  //
        alert('ddd')
        // , this.onLoadUI
        this.onInitialLoad(this.onLoadVerbs)
        .finally(() => this.offSpinner())
        .then(verbs => {
            this.onSetVerbs(verbs);  // possibly without it ?
            this.onLoadUI();
            this.onSetRandomVerbForm();
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
        this.onSetRandomVerbForm();
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
            return verbs[0];
        })
        .catch(error => {
            throw error;
        })
    }
    onSetVerbs = verbs => {
        this.model.setVerbs(verbs);
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
    onSetRandomVerbForm = () => this.model.setRandomVerbForm();
    onDisplayVerbs = (verb, form) => this.view.displayVerbs(verb, form);
    onDisplayAnswer = (verb, form) => this.view.displayAnswer(verb, form);
    onConfirmAnswer = form => this.view.confirmAnswer(form);
    // bindEditTodo
}

// const runApp = window.onload = function(){ new Controller(new Model('../data/data.json'), new View())};
const runApp = new Controller(new Model('../data/data.json'), new View());

// console.log('Hello');    

