export class PlotDataObject {
    constructor(plotData) {
        this.plotData = plotData;
    }

    get regionConfig() {
        return this.plotData?.plot?.location;
    }
    get regionConfigNoGeometry() {
        let regionConfig = this.plotData?.plot?.location;
        delete regionConfig?.geojson?.geometry;
        return regionConfig;
    }
}
