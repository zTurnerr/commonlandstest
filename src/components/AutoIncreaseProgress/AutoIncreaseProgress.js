import { Progress } from 'native-base';
import React, { useEffect, useState } from 'react';

const AutoIncreaseProgress = () => {
    const [value, setValue] = useState(0);

    useEffect(() => {
        let timer = setInterval(() => {
            setValue((prev) => {
                if (prev + 100 / 16 >= 100) {
                    return prev;
                }
                return prev + 100 / 16;
            });
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return <Progress h="5px" colorScheme="primary" value={value} />;
};

export default AutoIncreaseProgress;
