class View {
  #onRefreshTask;
  #statistics = document.querySelector('.statistics');
  #spinner = document.querySelector('.spinner');
  #form = document.querySelector('.form');
  #inputs = document.getElementsByClassName('form__input');
  #nativeVerbNode = document.querySelector('.verb__native');
  #answerNode = document.querySelector('.answer');
  #incorrect = document.querySelector('.statistics__incorrect');
  #correct = document.querySelector('.statistics__correct');
  #total = document.querySelector('.statistics__total');
  #loaded = document.querySelector('.statistics__loaded');
  #headerBurger = document.querySelector('.header__burger');

  constructor() {
    this.#initLocalListeners();
  }
  #initLocalListeners() {
    this.#headerBurger.addEventListener('click', () => {
      this.#statistics.classList.toggle('statistics__active');
    });
  }
  #refreshTask(answer, input) {
    const reset = () => {
      input.classList.remove('form__input_rejected', 'form__input_confirmed');
      this.#answerNode.textContent = '';
      this.#onRefreshTask();
    };
    setTimeout(reset, answer ? 1800 : 3500);
  }
  hideSpinner() {
    this.#spinner.classList.add('spinner_hide');
  }
  showError(error) {
    const errorNode = document.querySelector('.error');
    errorNode.classList.add('error_active');
    const errorMessage = errorNode.querySelector('.error__message');
    errorMessage.textContent = error;
  }
  displayStatistics(statistics) {
    this.#incorrect.textContent = statistics.incorrect;
    this.#correct.textContent = statistics.correct;
    this.#total.textContent = statistics.total;
    this.#loaded.textContent = statistics.loaded;
  }
  displayTask({ verb, form }) {
    this.#nativeVerbNode.textContent = verb.at(-1);
    verb.slice(0, -1).forEach((item, index) => {
      if (index !== form) {
        this.#inputs[index].value = item;
        this.#inputs[index].disabled = true;
      } else {
        this.#inputs[form].value = '';
        this.#inputs[form].disabled = false;
        this.#inputs[form].focus();
      }
    });
  }
  bindEditVerb(handler) {
    const handleEdit = (event) => {
      if (event.target.className !== 'form__input') return;
      handler(event.target.value);
    };
    this.#form.addEventListener('change', handleEdit);
  }
  handleAudit(data) {
    const {
      common,
      input: { verb, form, correctAnswer },
    } = data;
    const input = [...this.#inputs].find((input) => !input.disabled);
    input.disabled = true;
    const cssClassName = correctAnswer
      ? 'form__input_confirmed'
      : 'form__input_rejected';
    input.classList.add(cssClassName);
    this.#answerNode.textContent = correctAnswer ? '' : verb[form];
    this.displayStatistics(common);
    this.#refreshTask(correctAnswer, input);
  }
  bindRefreshTask(callback) {
    this.#onRefreshTask = callback;
  }
}

export { View };
