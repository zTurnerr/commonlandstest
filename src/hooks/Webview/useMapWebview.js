import { SEND_TYPE, setCenter } from '../../util/Constants';

const featuresOfMap = ['doubleClickZoom', 'dragPan', 'touchZoomRotate', 'scrollZoom'];

const useMapWebview = (webviewRef, plotData = {}) => {
    const sendMessage = (data) => {
        webviewRef?.current?.postMessage(JSON.stringify(data));
    };

    const lockMap = () => {
        sendMessage({
            type: SEND_TYPE.disabledFeatures,
            features: featuresOfMap,
        });
    };

    const unlockMap = () => {
        sendMessage({
            type: SEND_TYPE.enableFeatures,
            features: featuresOfMap,
        });
    };

    const centerMap = () => {
        setCenter({
            ref: webviewRef,
            long: plotData?.plot?.centroid[0],
            lat: plotData?.plot?.centroid[1],
        });
    };

    return {
        sendMessage,
        lockMap,
        unlockMap,
        centerMap,
    };
};

export default useMapWebview;
