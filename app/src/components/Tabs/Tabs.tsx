import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { TabsProps } from './TabsProps';

export default function Tabs({ selectedIndex, children }: TabsProps): JSX.Element {
    const [activeTab, setActiveTab] = useState<number>(selectedIndex);

    useEffect(() => {
        console.log(selectedIndex);
        setActiveTab(selectedIndex);
    }, [setActiveTab, selectedIndex]);

    const onClickTabItem = (index: number, onSelect?: () => void) => {
        setActiveTab(index);

        if (onSelect) {
            onSelect();
        }
    };

    const onClickTabIcon = (onIconClick?: () => void) => {
        if (onIconClick) {
            onIconClick();
        }
    };

    return (
        <div className="is-flex is-flex-direction-column is-fullheight">
            <div className="tabs is-boxed is-normal mb-0">
                <ul>
                    {children?.map((child, i) => {
                        const { index, title, icon, onSelect, onIconClick } = child.props;

                        return (
                            <li key={`tab-${i}`} className={activeTab === index ? 'is-active' : ''}>
                                <a onClick={() => onClickTabItem(index, onSelect)}>
                                    <span>{title}</span>
                                    <span
                                        className="icon is-small"
                                        onClick={() => onClickTabIcon(onIconClick)}
                                    >
                                        <FontAwesomeIcon icon={icon} />
                                    </span>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="has-background-grey-dark is-flex-grow-1">
                {children.find((child) => child.props.index === activeTab)}
            </div>
        </div>
    );
}
