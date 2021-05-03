import { TabProps } from './TabProps';

export interface TabsProps {
    selectedIndex: number;
    children: React.ReactElement<TabProps>[];
}
