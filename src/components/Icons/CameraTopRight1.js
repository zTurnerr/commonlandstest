import { useTheme } from 'native-base';
import * as React from 'react';
import Svg, { Defs, G, Path } from 'react-native-svg';

/* SVGR has dropped some elements not supported by react-native-svg: filter */
const CameraTopRight1 = ({ color = '#fff', ...other }) => {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" width={70} height={87} fill="none" {...other}>
            <G filter="url(#a)">
                <Path
                    stroke={currentColor}
                    strokeLinecap="square"
                    strokeWidth={6}
                    d="M5 5h59a1 1 0 0 1 1 1v76"
                />
            </G>
            <Defs></Defs>
        </Svg>
    );
};
export default CameraTopRight1;
