export interface SelectOption {
    id: string;
    name: string;
}

export interface SelectProps {
    className?: string;
    initialValue?: string;
    options: SelectOption[];
    onChange: (id: string) => void;
}
