export interface ListProps<T> {
    items: T[];
    areSame: (item1: T | undefined | null, item2: T | undefined | null) => boolean;
    render: (item: T) => JSX.Element;
    onSelectionChange?: (item: T | null, index: number) => void;
}
