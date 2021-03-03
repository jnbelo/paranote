export interface FormBrowserFieldProps {
    id: string;
    label: string;
    placeholder?: string;
    browserLabel?: string;
    error?: string;
    onBrowse: () => Promise<string>;
}
