/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { useTheme } from 'native-base';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function Index({ color, width = '16', height = '16', ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg width={width} height={height} viewBox="0 0 16 16" fill="none" {...other}>
            <Path
                d="M7.99992 8.95321C9.14867 8.95321 10.0799 8.02197 10.0799 6.87321C10.0799 5.72446 9.14867 4.79321 7.99992 4.79321C6.85117 4.79321 5.91992 5.72446 5.91992 6.87321C5.91992 8.02197 6.85117 8.95321 7.99992 8.95321Z"
                stroke={currentColor}
                stroke-width="1.5"
            />
            <Path
                d="M2.4133 5.65992C3.72664 -0.113413 12.28 -0.106746 13.5866 5.66659C14.3533 9.05325 12.2466 11.9199 10.4 13.6933C9.05997 14.9866 6.93997 14.9866 5.5933 13.6933C3.7533 11.9199 1.64664 9.04659 2.4133 5.65992Z"
                stroke={currentColor}
                stroke-width="1.5"
            />
        </Svg>
    );
}
