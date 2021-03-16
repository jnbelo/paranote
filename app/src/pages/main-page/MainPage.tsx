import { faTimes } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useSelector } from 'react-redux';
import Tab from '../../components/Tabs/Tab';
import Tabs from '../../components/Tabs/Tabs';
import { selectSources } from '../../redux/selectors/sources.selectors';

export default function MainPage(): JSX.Element {
    const sources = useSelector(selectSources);

    return (
        <Tabs>
            {sources.map((source, index) => (
                <Tab index={index} title={source.name} icon={faTimes}>
                    <div>TEST</div>
                </Tab>
            ))}
        </Tabs>
    );
}
