import { formatDistanceToNow, parseISO } from 'date-fns';
import React from 'react';

import { TimeAgoProps } from './TimeAgoProps';

export default function TimeAgo({ className, timestamp }: TimeAgoProps): JSX.Element {
    let timeAgo = '';
    if (timestamp) {
        const date = parseISO(timestamp);
        const timePeriod = formatDistanceToNow(date);
        timeAgo = `${timePeriod} ago`;
    }

    return (
        <span title={timestamp} className={className}>
            &nbsp;{timeAgo}
        </span>
    );
}
