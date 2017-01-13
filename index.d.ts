declare module "redux-saga-resources" {
    interface IActions {
        CREATE: string;
        CREATE_CANCEL: string;
        CREATE_SUCCESS: string;
        CREATE_FAILURE: string;

        READ: string;
        READ_CANCEL: string;
        READ_SUCCESS: string;
        READ_FAILURE: string;

        UPDATE: string;
        UPDATE_CANCEL: string;
        UPDATE_SUCCESS: string;
        UPDATE_FAILURE: string;

        DELETE: string;
        DELETE_CANCEL: string;
        DELETE_SUCCESS: string;
        DELETE_FAILURE: string;

        LIST: string;
        LIST_CANCEL: string;
        LIST_SUCCESS: string;
        LIST_FAILURE: string;

        RESET: string;
    }

    interface ICreators {
        doCreate(item): any;
        doCreateCancel(item): any;
        doCreateSuccess(item): any;
        doCreateFailure(item, reason): any;

        doRead(item): any;
        doReadCancel(item): any;
        doReadSuccess(item): any;
        doReadFailure(item, reason): any;

        doUpdate(item): any;
        doUpdateCancel(item): any;
        doUpdateSuccess(item): any;
        doUpdateFailure(item, reason): any;

        doDelete(item): any;
        doDeleteCancel(item): any;
        doDeleteSuccess(item): any;
        doDeleteFailure(item, reason): any;

        doList(): any;
        doListCancel(): any;
        doListSuccess(): any;
        doListFailure(reason): any;

        doReset(): any;
    }

    interface ISelectors {
        loading(state): boolean;
        error(state): string;
        items(state): any[];
        itemById(state, id): any;
        itemByItem(state, item): any;
    }

    interface IFieldSelectors {
        key(item): string;
        id(item): string;
        newId(item): string;
        status(item): boolean;
        error(item): any;
        isModified(item): boolean;
        isReading(item): boolean;
        isRead(item): boolean;
        isCreating(item): boolean;
        isCreated(item): boolean;
        isRemoving(item): boolean;
        isRemoved(item): boolean;
        isUpdating(item): boolean;
        isUpdated(item): boolean;
        isUnchanged(item): boolean;
        isChanging(item): boolean;
        neverCommited(item): boolean;
        hasCommited(item): boolean;
    }

    interface IResourceDescriptor {
        name: string;
        actions: IActions;
        creators: ICreators;
        selectors: ISelectors;
        fields: IFieldSelectors;
        hasSameId(left, right): boolean;
    }
    interface IResource extends IResourceDescriptor {
        create(props): any;
        reducer: (state, action) => any;
        saga: () => any;
    }

    interface IEditorActions {
        EDIT: string;
        SELECT: string;

        CREATE: string;
        CREATE_CANCEL: string;
        CREATE_SUCCESS: string;
        CREATE_FAILURE: string;

        READ: string;
        READ_CANCEL: string;
        READ_SUCCESS: string;
        READ_FAILURE: string;

        UPDATE: string;
        UPDATE_CANCEL: string;
        UPDATE_SUCCESS: string;
        UPDATE_FAILURE: string;

        DELETE: string;
        DELETE_CANCEL: string;
        DELETE_SUCCESS: string;
        DELETE_FAILURE: string;

        RESET: string;
    }

    interface IEditorCreators {
        doEdit(item): any;
        doSelect(item): any;

        doCreate(item): any;
        doCreateCancel(item): any;
        doCreateSuccess(item): any;
        doCreateFailure(item, reason): any;

        doRead(item): any;
        doReadCancel(item): any;
        doReadSuccess(item): any;
        doReadFailure(item, reason): any;

        doUpdate(item): any;
        doUpdateCancel(item): any;
        doUpdateSuccess(item): any;
        doUpdateFailure(item, reason): any;

        doDelete(item): any;
        doDeleteCancel(item): any;
        doDeleteSuccess(item): any;
        doDeleteFailure(item, reason): any;

        doReset(): any;
    }
    interface IEditorSelectors {
        opened(state): boolean;
        loading(state): boolean;
        error(state): string;
        item(state): any;
        isItem(item): (state) => boolean;
    }
    interface IEditorDescriptor {
        name: string;
        actions: IEditorActions;
        creators: IEditorCreators;
        selectors: IEditorSelectors;
    }
    interface IEditor extends IEditorDescriptor {
        create(props): any;
        reducer: (state, action) => any;
        saga: () => any;
    }

    interface IMiddlewareFactory {
        (resource: IResourceDescriptor): IMiddleware;
    }
    interface IMiddleware {
        (action, next: (action?) => any);
    }

    interface IOptions {
        id?: string;
    }

    function createResource(name, options: IOptions, ...middlewares: IMiddlewareFactory[]): IResource;
    function createEditor(name, options: IOptions, resource: IResource): IEditor;
    function httpMiddleware(api, path): IMiddlewareFactory;
}
