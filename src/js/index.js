import { Model } from './model/index.js';
import { View } from './view/index.js';
import { Controller } from './controller/index.js';

const model = new Model('../assets/data/data.json');
const view = new View();
new Controller(model, view);
