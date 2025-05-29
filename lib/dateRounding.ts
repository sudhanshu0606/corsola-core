function roundUpToNearest10Minutes(date: Date): Date {
    
    const minutes = date.getMinutes();
    const remainder = minutes % 10;

    if (remainder === 0) { return new Date(date) }

    const diff = 10 - remainder;

    const rounded = new Date(date);

    rounded.setMinutes(minutes + diff);
    rounded.setSeconds(0);
    rounded.setMilliseconds(0);

    return rounded;

}

export { roundUpToNearest10Minutes }