# redux-saga-resources

See also [Simple Editor](https://github.com/Zaibot/redux-saga-resources/blob/master/docs/simplecrudeditor.md)

[GitHub](https://github.com/Zaibot/redux-saga-resources)

## Example
Simple example of CRUD operators

**resource.ts**
```
import { createResource, restMiddleware } from 'redux-saga-resources';

export default createResource('items', {}, defaultJsonRestMiddleware('/api/items'));
```

**store.ts**
```jsx
import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import itemsResource from './resource';

export default function configureStore() {
  const saga = createSagaMiddleware();
  const store = createStore(itemsResource.reducer, null, saga);
  saga.run(itemsResource.saga);
  return store;
}
```

**app.ts**
```jsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import configureStore from './store';
import itemsResource from './resource';

const App = connect(
  (state) => ({
    items: itemsResource.selectors.items(state)
  }),
  (dispatch) => ({
    createNewItem: () => dispatch(itemsResource.creators.create({ title: 'Item title', counter: 0 })),
    updateItem: (item) => dispatch(itemsResource.creators.update(item)),
    removeItem: (item) => dispatch(itemsResource.creators.remove(item))
  })
)(({ items, create, save, remove }) => (
  <div>
    <div>
      <button type="button" onClick={createNewItem}>Add new item</button>
    </div>
    <div>
      {items.map(item => <Item item={item} onSave={onSave} onDelete={onDelete} />)}
    </div>
  </div>
));

const Item = ({ item, onSave, onDelete }) => (
  <div>
    <span>{item.title} {item.counter}</span>
    <button type="button" onClick={() => onDelete(item)}>remove</button>
    <button type="button" onClick={() => onSave({ ...item, counter: item.counter + 1 })}>increase</button>
  </div>
);
```

**index.ts**
```jsx
const store = configureStore();
ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('app'));
```
