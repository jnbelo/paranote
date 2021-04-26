export interface ButtonToggleProps {
    buttons: JSX.Element[];
    defaultIndex?: number;
    onSelect: (index: number) => void;
}
