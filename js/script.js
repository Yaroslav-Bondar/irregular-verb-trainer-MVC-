class Model {
    constructor(verbsUrl) {
        this.verbsUrl = verbsUrl;
        this.checkInputReg = /^\s*[a-z]+\s*$/i;
        this.answer;
        this.statistics = {
            incorrect: 0,
            correct: 0,
            total: 0,
            loaded: 0,
        }
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
            .then(verbs => {
                this.verbs = verbs;
                this.statistics.loaded = verbs.length;
                return verbs;
            })
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
        this.statistics.total++;
        if(this.answer) {
            this.statistics.correct++;
        }
        else {
            this.statistics.incorrect++;
        }
    }
};
class View {
    constructor() {
        this.spinner = document.querySelector('.spinner'); 
        this.error = this.createElement('div', 'error');
        this.form = document.querySelector('.form');
        this.inputs = document.getElementsByClassName('form__input');
        this.nativeVerbNode = document.querySelector('.verb__native');
        this.answerNode = document.querySelector('.answer');
        this.incorrect = document.querySelector('.statistics__incorrect');
        this.correct = document.querySelector('.statistics__correct');
        this.total = document.querySelector('.statistics__total');
        this.loaded = document.querySelector('.statistics__loaded');
    }
    hideSpinner() {
        this.spinner.classList.add('spinner_hide');
    }
    showError(error) {
        this.spinner.after(this.error);
        this.error.innerHTML = 
        `<div class="error__container">
            <div class="error__wrapper">
                <h2 class="error__title">&#x1F621; No acces !!!</h2>
                <p class="error__message">${error}</p>
                <h4>please try again later</h4>
            </div>
        </div>`;
    }
    displayStatistics(statistics) {
        this.incorrect.innerHTML = statistics.incorrect;
        this.correct.innerHTML = statistics.correct;
        this.total.innerHTML = statistics.total;
        if(!this.loaded.innerHTML) {
            this.loaded.innerHTML = statistics.loaded;
        }
    }
    loadDOM() {  
        return new Promise(resolve => {
            document.addEventListener('DOMContentLoaded', () => {
                resolve('DOM fully loaded and parsed');
            });
        });
    }
    // _createCloneElements(element, amount) {
    //     let elements = [];
    //     while(amount--) elements.push(element.cloneNode(true));
    //     return elements;
    // }
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
        this.answerNode.innerHTML = verbs[form];
        // this.answerNode.classList.add('answer__backlight');
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
                    this.answerNode.innerHTML = '';
                    // this.answerNode.classList.remove('answer__backlight');
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
        this.run(this.onLoadVerbs, this.onLoadDOM);
    }
    run(loadVerbs, loadDOM) {
        Promise.all([loadVerbs(), loadDOM()])  // tasks before launch
        .finally(() => this.offSpinner())
        .then((res) => {
            console.log(res);
            this.onSetRandomVerbData();
            this.onDisplayVerbs(this.model.randomVerb, this.model.randomForm, this.model.nativeVerb);
            this.onDisplayStatistics(this.model.statistics);
            this.view.bindEditVerb(this.handleEditVerb.bind(this));
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
        this.onDisplayStatistics(this.model.statistics);
        await this.onResetMessage(this.model.randomForm);
        this.onSetRandomVerbData();
        this.onDisplayVerbs(this.model.randomVerb, this.model.randomForm, this.model.nativeVerb);
    };
    offSpinner = () => this.view.hideSpinner();
    onError = error => this.view.showError(error);
    onLoadVerbs = () => this.model.loadVerbs();
    onLoadDOM = () => this.view.loadDOM();
    onSetRandomVerbData = () => this.model.setRandomVerbData();
    onDisplayVerbs = (verb, form, nativeVerb) => this.view.displayVerbs(verb, form, nativeVerb);
    onCheckAnswer = answer => this.model.checkAnswer(answer);
    onDisplayAnswer = (verb, form) => this.view.displayAnswer(verb, form);
    onConfirmAnswer = form => this.view.confirmAnswer(form);
    onRejectAnswer = form => this.view.rejectAnswer(form);
    onResetMessage = form => this.view.resetMessage(form);
    onUpdateStatistics = () => this.model.updateStatistics();
    onDisplayStatistics = statistics => this.view.displayStatistics(statistics);
}

const runApp = new Controller(new Model('dat/data.json'), new View());