/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { useTheme } from 'native-base';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function Index({ color, width = '24', height = '24', ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...other}>
            <Path
                d="M18.3398 14.13L16.1598 12.38C15.8498 12.14 15.4598 12 15.0598 12H12.7498V9H17.2198C18.1898 9 18.9698 8.22 18.9698 7.25V3.75C18.9698 2.78 18.1898 2 17.2198 2H8.95984C8.56984 2 8.17984 2.14 7.86984 2.38L5.67984 4.13C4.80984 4.83 4.80984 6.17 5.67984 6.87L7.86984 8.62C8.17984 8.86 8.56984 9 8.95984 9H11.2498V12H6.79984C5.82984 12 5.04984 12.78 5.04984 13.75V17.25C5.04984 18.22 5.82984 19 6.79984 19H11.2498V21.25H8.99984C8.58984 21.25 8.24984 21.59 8.24984 22C8.24984 22.41 8.58984 22.75 8.99984 22.75H14.9998C15.4098 22.75 15.7498 22.41 15.7498 22C15.7498 21.59 15.4098 21.25 14.9998 21.25H12.7498V19H15.0598C15.4598 19 15.8498 18.86 16.1598 18.62L18.3398 16.87C19.2198 16.17 19.2198 14.83 18.3398 14.13Z"
                fill={currentColor}
            />
        </Svg>
    );
}
