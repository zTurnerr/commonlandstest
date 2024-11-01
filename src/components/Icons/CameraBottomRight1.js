import { useTheme } from 'native-base';
import * as React from 'react';
import Svg, { Defs, G, Path } from 'react-native-svg';

/* SVGR has dropped some elements not supported by react-native-svg: filter */
const CameraBottomRight1 = ({ color = '#fff', width = '69', height = '88', ...other }) => {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            fill="none"
            {...other}
        >
            <G filter="url(#a)">
                <Path
                    stroke={currentColor}
                    strokeLinecap="square"
                    strokeWidth={6}
                    d="M64 5v77a1 1 0 0 1-1 1H5"
                />
            </G>
            <Defs></Defs>
        </Svg>
    );
};
export default CameraBottomRight1;
