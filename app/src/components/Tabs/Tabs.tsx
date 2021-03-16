import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { TabsProps } from './TabsProps';

export default function Tabs({ children }: TabsProps): JSX.Element {
    const [activeTab, setActiveTab] = useState<number>(-1);

    const onClickTabItem = (index: number) => {
        setActiveTab(index);
    };

    return (
        <div>
            <div className="tabs is-boxed is-small">
                <ul>
                    {children?.map((child) => {
                        const { index, title, icon } = child.props;

                        return (
                            <li className={activeTab === index ? 'is-active' : ''}>
                                <a onClick={() => onClickTabItem(index)}>
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
