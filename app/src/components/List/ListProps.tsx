export interface ListProps<T> {
    items: T[];
    render: (item: T) => JSX.Element;
    sortBy?: (a: T, b: T) => number;
    onSelectionChange?: (item: T, index: number) => void;
}
