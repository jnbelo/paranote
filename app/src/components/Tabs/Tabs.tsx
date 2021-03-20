import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { TabsProps } from './TabsProps';

export default function Tabs({ children }: TabsProps): JSX.Element {
    const [activeTab, setActiveTab] = useState<number>(0);

    const onClickTabItem = (index: number, onSelect?: () => void) => {
        setActiveTab(index);

        if (onSelect) {
            onSelect();
        }
    };

    return (
        <div>
            <div className="tabs is-boxed is-small">
                <ul>
                    {children?.map((child, i) => {
                        const { index, title, icon, onSelect } = child.props;

                        return (
                            <li key={`tab-${i}`} className={activeTab === index ? 'is-active' : ''}>
                                <a onClick={() => onClickTabItem(index, onSelect)}>
                                    <span>{title}</span>
                                    <span className="icon is-small">
                                        <FontAwesomeIcon icon={icon} />
                                    </span>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="tab-content">
                {children.find((child) => child.props.index === activeTab)}
            </div>
        </div>
    );
}
