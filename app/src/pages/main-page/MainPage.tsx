import React from 'react';
import { useSelector } from 'react-redux';
import { selectSources } from '../../redux/selectors/sources.selectors';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function MainPage(): JSX.Element {
    const sources = useSelector(selectSources);

    return (
        <div className="tabs is-boxed is-small">
            <ul>
                {sources.map((source, index) => (
                    <li className={index === 0 ? 'ios-active' : ''}>
                        <a>
                            <span>{source.name}</span>
                            <span className="icon is-small">
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
