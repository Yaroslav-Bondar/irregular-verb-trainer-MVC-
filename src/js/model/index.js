class Model {
  #MAX_VERB_INDEX = 3;
  #dataUrl;
  #verbs;
  #onTaskChanged;
  #onAnswerChecked;
  #store = {
    common: {
      incorrect: 0,
      correct: 0,
      total: 0,
      loaded: 0,
    },
    inputs: [],
  };

  constructor(url) {
    this.#dataUrl = url;
  }
  static getRandNum = (max) => Math.floor(Math.random() * max);
  get commonStore() {
    return structuredClone(this.#store.common);
  }
  async loadVerbs(callback) {
    try {
      const response = await fetch(this.#dataUrl);
      this.#verbs = await response.json();
      this.#store.common.loaded = this.#verbs.length;
      callback();
    } catch (error) {
      console.error(error);
      callback(error);
    }
  }
  setNextTask() {
    const data = {
      verb: [...this.#verbs[Model.getRandNum(this.#verbs.length)]],
      form: Model.getRandNum(this.#MAX_VERB_INDEX),
    };
    this.#store.inputs.push(structuredClone(data));
    this.#onTaskChanged(structuredClone(data));
  }
  handleInput(input) {
    const { verb, form } = this.#store.inputs.at(-1);
    const regExp = new RegExp(`^\\s*${verb[form]}\\s*$`, 'i');
    const matched = input.match(regExp);
    const correctAnswer = matched ? matched[0] : matched;
    this.#store = {
      ...this.#store,
      common: {
        ...this.#store.common,
        total: this.#store.common.total + 1,
        correct: correctAnswer
          ? this.#store.common.correct + 1
          : this.#store.common.correct,
        incorrect: correctAnswer
          ? this.#store.common.incorrect
          : this.#store.common.incorrect + 1,
      },
    };
    this.#store.inputs = this.#store.inputs.with(-1, {
      ...this.#store.inputs.at(-1),
      input,
      correctAnswer,
    });
    this.#onAnswerChecked({
      common: structuredClone(this.#store.common),
      input: structuredClone(this.#store.inputs.at(-1)),
    });
  }
  bindTaskChanged(callback) {
    this.#onTaskChanged = callback;
  }
  bindAnswerChecked(callback) {
    this.#onAnswerChecked = callback;
  }
}

export { Model };
