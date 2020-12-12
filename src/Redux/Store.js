import { createStore } from 'redux';
import reducer from './Reducer'

export  let store = createStore(reducer);
