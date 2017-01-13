# redux-saga-resources

**Module under development**

## Usage

**Install**
```
npm install --save redux-saga-resources redux-saga-rest
```

**Configuration**
```jsx
import { API, defaultMiddleware } from 'redux-saga-rest';
import { createResource, createEditor, httpMiddleware } from 'redux-saga-resources';

const api = new API('/api')
  .use(defaultMiddleware());

export const resource = createResource('post', api, httpMiddleware('/posts', api));
export const editor = createEditor(resource);
```

**Implementation**
```jsx
import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

const saga = createSagaMiddleware();
const store = createStore(
  combineReducers({
    postResource: resource.reducer,
    postEditor: editor.reducer
  }),
  null,
  applyMiddleware(
    saga
  )
);
saga.run(resource.saga);
```

**Examples**
```jsx
store.dispatch(resource.creators.doList());
store.dispatch(resource.creators.doCreate(resource.create({ title: 'New Post' })));
store.dispatch(editor.creators.doCreate({ title: 'New Post' }));
```

## React
**List of items**
```jsx
@connect(
  (state) => ({
    items: resource.selectors.items(state)
  }),
  (dispatch) => ({
    create: () => dispatch(editor.creators.doCreate({ title: 'New Post' })),
    edit: (item) => dispatch(editor.creators.doEdit(item))
  })
)
class App extends Component {
  render() {
    return (
      <div>
        <button type="button" onClick={() => this.props.create()}>New Post</button>
        {this.props.items.map(post => (
          <div class="item">
            {post.title}
            <button type="button" onClick={() => this.props.edit(post)}>edit</button>
          </div>
        ))}
      </div>
    )
  }
}
```

**Edit single item**
```jsx
@connect(
  (state) => ({
    item: editor.selectors.item(state),
    unmodified: resource.fields.isUnmodified(editor.selectors.item(state)),
    neverCommited: resource.fields.neverCommited(editor.selectors.item(state))
  }),
  (dispatch) => ({
    create: () => dispatch(editor.creators.doCreate({ title: 'New Post' })),
    edit: (item) => dispatch(editor.creators.doEdit(item)),
    reload: (item) => dispatch(editor.creators.doRead(item)),
    save: (item) => dispatch(editor.creators.doUpdate(item)),
    remove: (item) => dispatch(editor.creators.doDelete(item))
  })
)
class BlogPost extends Component {
  render() {
    return (
      <form>
        <input placeholder="Title" value={this.props.item.title} onChange={(e) => this.props.edit({ ...this.props.item, title: e.target.value })} />
        <br/>
        <button type="button" onClick={() => this.props.create()}>New</button>
        <button type="button" onClick={() => this.props.reload()} disabled={this.props.neverCommited}>Reload</button>
        <button type="button" onClick={() => this.props.remove()} disabled={this.props.neverCommited}>Delete</button>
        <button type="button" onClick={() => this.props.save()} disabled={this.props.unmodified}>Save</button>
      </form>
    )
  }
}
```
