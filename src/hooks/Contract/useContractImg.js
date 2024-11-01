import { useEffect, useState } from 'react';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_NAME } from '../../constants/eventName';

const useContractImg = () => {
    const [imgList, setImgList] = useState([]);

    useEffect(() => {
        const listener = EventRegister.addEventListener(EVENT_NAME.contractUploadPhoto1, (data) => {
            try {
                setImgList([...imgList, ...data]);
            } catch (error) {}
        });
        return () => {
            EventRegister.removeEventListener(listener);
        };
    }, [imgList]);

    return {
        imgList,
        setImgList,
    };
};

export default useContractImg;
