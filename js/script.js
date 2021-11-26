class Model {
    constructor(verbsUrl) {
        this.verbsUrl = verbsUrl;
        this.checkInputReg = /^\s*[a-z]+\s*$/i;
        this.answer;
        this.allAnswers = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        // this.verbs; this.randomVerb; this.randomForm; this.nativeVerb; // property list
    }
    get MAX_VERB_INDEX() {   // constant inside the class
        return 3;
    }
    set MAX_VERB_INDEX(value) {
        throw new Error('MAX_VERB_INDEX is immutable');
    }
    loadVerbs() {
        return fetch(this.verbsUrl)
            .then(res => res.json())
            .then(verbs => this.verbs = verbs)
            .catch(error => { throw new Error(error) });/* { (===) or return Promise.reject(error) } */
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
        return checkInput && checkAnswer ? this.answer = true : this.answer = false;
    }
    updateStatistics() {
        this.allAnswers++
        if(this.answer) {
            this.correctAnswers++;
        }
        else {
            this.wrongAnswers++;
        }
        console.log(this.allAnswers, this.correctAnswers, this.wrongAnswers);
    }
};
class View {
    constructor() {
        this.root = document.getElementById('root');
        this.spinner = this.createElement('div', 'spinner');
        this.error = this.createElement('div', 'error');
        this.root.append(this.spinner, this.error);
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
        return new Promise(resolve => {
            this.wrapper = this.createElement('wrapper', 'wrapper');
            this.header = this.createElement('header', 'header');
            this.header.append(this.wrapper);
            this.main = this.createElement('main', 'main');
            this.main.append(this.wrapper);
            this.footer = this.createElement('footer', 'footer');
            this.footer.append(this.wrapper);
            this.form = this.createElement('form', 'form');
            this.input = this.createElement('input', 'form__input');
            this.input.type = 'text';
            this.nativeVerbNode = this.createElement('div', 'verb__native');
            this.answer = this.createElement('div', 'answer');
            // let statisticsHtml = '<span class="statistics__name">incorrect</span><span class="statistics__value"></span>';
            this.statistics = this.createElement('div', 'statistics');
            this.form.append(this.nativeVerbNode, ...this._createCloneElements(this.input, 3), this.answer);
            this.main.append(this.form);
            this.footer.append(this.statistics);
            this.root.append(this.header, this.main, this.footer);
            this.statistics.outerHTML = 
            `<div class="statistics">
                <span class="statistics__column">
                    <span class="statistics__name">incorrect</span>
                    <span class="statistics__incorrect"></span>
                </span>
                <span class="statistics__column">
                    <span class="statistics__name">correct</span>
                    <span class="statistics__correct"></span>
                </span>
                <span class="statistics__column">
                    <span class="statistics__name">all</span>
                    <span class="statistics__all"></span>
                </span>
            </div>`;
            this.incorrect = document.querySelector('.statistics__incorrect');
            this.correct = this.root.querySelector('.statistics__correct');
            this.all = this.root.querySelector('.statistics__all');
            this.inputs = this.root.getElementsByClassName('form__input');
            resolve('UI is loaded');
        });
    }
    displayStatistics(incorrect, correct, all) {
        this.incorrect.innerHTML = `${incorrect}`;
        this.correct.innerHTML = `${correct}`;
        this.all.innerHTML = `${all}`;
    }
    loadDOM() {  
        return new Promise(resolve => {
            document.addEventListener('DOMContentLoaded', () => {
                resolve('DOM fully loaded and parsed');
            });
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
    displayVerbs(verbs, form, nativeVerb) {
        this.nativeVerbNode.innerHTML = nativeVerb;
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
        this.answer.classList.add('answer__backlight');
    }
    confirmAnswer(form) {
        this.inputs[form].classList.add('form__input_confirmed');
        this.inputs[form].disabled = true;  
    }
    rejectAnswer(form) {
        this.inputs[form].classList.add('form__input_rejected');
        this.inputs[form].disabled = true;  
    }
    resetMessage(form) {
        return new Promise(resolve => {
            let delay = 2000, wrongAnswer;
            if(wrongAnswer = this.inputs[form].classList.contains('form__input_rejected')) delay = 3500;
            setTimeout(()=> {
                if(wrongAnswer) {
                    this.inputs[form].classList.remove('form__input_rejected');
                    this.answer.innerHTML = '';
                    this.answer.classList.remove('answer__backlight');
                }
                else {
                    this.inputs[form].classList.remove('form__input_confirmed');
                }
                return resolve();
            }, delay);
        });
    }
};
class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.run(this.onLoadVerbs, this.onLoadDOM, this.onLoadUI);
    }
    run(loadVerbs, loadDOM, loadUI) {
        this.onSpinner();   
        Promise.all([loadVerbs(), loadDOM(), loadUI()])  // tasks before launch
        .finally(() => this.offSpinner())
        .then((res) => {
            console.log(res);
            // this.onLoadUI();
            this.onSetRandomVerbData();
            this.onDisplayVerbs(this.model.randomVerb, this.model.randomForm, this.model.nativeVerb);
            this.onDisplayStatistics(this.model.wrongAnswers, this.model.correctAnswers, this.model.allAnswers);
            this.view.bindEditVerb(this.bindHandleEditVerb);
        })
        .catch(error => {
            this.onError(error.message);
            console.log(error.stack); 
        })
    };
    async handleEditVerb(answer) {
        if(this.onCheckAnswer(answer)) {
            this.onConfirmAnswer(this.model.randomForm);
        }
        else {
            this.onRejectAnswer(this.model.randomForm);
            this.onDisplayAnswer(this.model.randomVerb, this.model.randomForm);
        }
        this.onUpdateStatistics();
        this.onDisplayStatistics(this.model.wrongAnswers, this.model.correctAnswers, this.model.allAnswers);
        await this.onResetMessage(this.model.randomForm);
        this.onSetRandomVerbData();
        this.onDisplayVerbs(this.model.randomVerb, this.model.randomForm, this.model.nativeVerb);
    };
    bindHandleEditVerb = this.handleEditVerb.bind(this); // binding a context to a callback function
    onSpinner = () => this.view.showSpinner();
    offSpinner = () => this.view.hideSpinner();
    onError = error => this.view.showError(error);
    onLoadVerbs = () => this.model.loadVerbs();
    onLoadDOM = () => this.view.loadDOM();
    onLoadUI = () => this.view.loadUI();
    onSetRandomVerbData = () => this.model.setRandomVerbData();
    onDisplayVerbs = (verb, form, nativeVerb) => this.view.displayVerbs(verb, form, nativeVerb);
    onCheckAnswer = answer => this.model.checkAnswer(answer);
    onDisplayAnswer = (verb, form) => this.view.displayAnswer(verb, form);
    onConfirmAnswer = form => this.view.confirmAnswer(form);
    onRejectAnswer = form => this.view.rejectAnswer(form);
    onResetMessage = form => this.view.resetMessage(form);
    onUpdateStatistics = () => this.model.updateStatistics();
    onDisplayStatistics = (incorrect, correct, all) => this.view.displayStatistics(incorrect, correct, all);
}

const runApp = new Controller(new Model('../data/data.json'), new View());