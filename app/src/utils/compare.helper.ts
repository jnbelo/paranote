export const compareString = (a: string, b: string): number => {
    const upperA = a.toUpperCase();
    const upperB = b.toUpperCase();
    if (upperA < upperB) {
        return -1;
    }
    if (upperA > upperB) {
        return 1;
    }
    return 0;
};

export const compareDate = (dateA: Date, dateB: Date): number => {
    if (dateA < dateB) {
        return -1;
    }
    if (dateA > dateB) {
        return 1;
    }
    return 0;
};
