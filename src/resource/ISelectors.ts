export interface ISelectors<T> {
    loading(state: any): boolean;
    error(state: any): string;
    items(state: any): T[];
    itemById(id: string): (state: any) => T;
    itemByItem(item: T): (state: any) => T;
    params(state: any): any;
}
