import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface TabProps {
    index: number;
    title: string;
    icon: IconProp;
    children?: React.ReactElement;
    onSelect?: () => void;
    onIconClick?: () => void;
}
