import { useEffect, useState } from 'react';

let timer = null;

const useWaiting = (timeLimit) => {
    const [overLimit, setOverLimit] = useState(false);
    const [counter, setCounter] = useState(0);

    const resetWaiting = () => {
        setCounter(counter + 1);
        setOverLimit(false);
    };

    useEffect(() => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            setOverLimit(true);
        }, timeLimit);
        return () => clearTimeout(timer);
    }, [timeLimit, counter]);

    return { overLimit, resetWaiting };
};

export default useWaiting;
