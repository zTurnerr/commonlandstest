/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  THDLong / thdailong@gmail.com
 */
import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from 'native-base';
export default function Index({ color, width = '24', height = '24', ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...other}>
            <Path
                d="M8 12H16"
                stroke={currentColor}
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <Path
                d="M12 16V8"
                stroke={currentColor}
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <Path
                d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                stroke={currentColor}
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </Svg>
    );
}
