class Controller {
  #model;
  #view;
  constructor(model, view) {
    this.#model = model;
    this.#view = view;
    this.#model.loadVerbs(this.#launch.bind(this));
  }
  #launch(error) {
    this.#offSpinner();
    if (error) {
      this.#onError(error);
      return;
    }
    this.#model.bindTaskChanged(this.#onTaskChanged.bind(this));
    this.#view.bindEditVerb(this.#handleEditVerb.bind(this));
    this.#view.bindRefreshTask(this.#onRefreshTask.bind(this));
    this.#model.bindAnswerChecked(this.#onAnswerChecked.bind(this));
    this.#onInitRender(this.#model.commonStore);
    this.#onRefreshTask();
  }
  #onTaskChanged(data) {
    this.#view.displayTask(data);
  }
  #handleEditVerb(input) {
    this.#model.handleInput(input);
  }
  #onInitRender(data) {
    this.#view.displayStatistics(data);
  }
  #onRefreshTask() {
    this.#model.setNextTask();
  }
  #onAnswerChecked(answer) {
    this.#view.handleAudit(answer);
  }
  #offSpinner() {
    this.#view.hideSpinner();
  }
  #onError(error) {
    this.#view.showError(error);
  }
}

export { Controller };
