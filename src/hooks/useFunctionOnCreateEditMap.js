import Geolocation from '@react-native-community/geolocation';
import { useDisclose } from 'native-base';
import { useCallback, useState } from 'react';
// eslint-disable-next-line react-native/split-platform-components
import { PermissionsAndroid } from 'react-native';
import { SEND_TYPE } from '../util/Constants';

const useFunctionOnCreateEditMap = ({ sendMessage }) => {
    const {
        isOpen: isLocationAllow,
        onClose: onCloseLocation,
        onOpen: onOpenLocation,
    } = useDisclose(true);
    const [goingLocation, setGoingLocation] = useState(1);
    const {
        isOpen: isEnableSnap,
        onToggle: onToggleSnap,
        onOpen: onEnableSnap,
    } = useDisclose(true);
    const { isOpen: isOpenSnapModal, onToggle: onToggleModalSnap } = useDisclose();

    const getLocationPermission = async () => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            onOpenLocation();
        } else {
            onCloseLocation();
        }
    };

    const handleGotoMyLocation = useCallback(async () => {
        await getLocationPermission();
        Geolocation.getCurrentPosition((info) => {
            const coordinates = {
                geometry: {
                    coordinates: [info.coords.longitude, info.coords.latitude],
                },
                zoom: 15,
            };
            setGoingLocation(3);
            sendMessage({
                type: SEND_TYPE.flyTo,
                coordinates: coordinates,
            });
        });
    }, []);

    const handleWhenMapMove = () => {
        setGoingLocation((prev) => {
            if (prev >= 2) {
                return prev - 1;
            }
            return prev;
        });
    };

    return {
        isEnableSnap,
        onToggleSnap,
        onToggleModalSnap,
        isOpenSnapModal,
        handleGotoMyLocation,
        handleWhenMapMove,
        goingLocation,
        isLocationAllow,
        onEnableSnap,
    };
};

export default useFunctionOnCreateEditMap;
