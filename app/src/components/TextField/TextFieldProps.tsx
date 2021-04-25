export interface TextFieldProps {
    autoFocus?: boolean;
    placeholder?: string;
    value: string;
    onSubmit?: (value: string) => void;
    onCancel?: (value: string) => void;
}
