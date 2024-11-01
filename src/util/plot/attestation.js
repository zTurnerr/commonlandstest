export const canAttestPlot = (userInfo, plotData) => {
    if (isAttested(plotData)) return false;
    return userInfo?.regionManagers?.some(
        (regionManager) => regionManager.locationConfig === plotData?.plot?.location?._id,
    );
};
export const isAttested = (plotData) => {
    return plotData?.plot?.attestationStamp?.isAttested;
};
