/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { useTheme } from 'native-base';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function Index({ color, width = '22', height = '22', ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg width={width} height={height} viewBox="0 0 22 22" fill="none" {...other}>
            <Path
                d="M8.38737 6.86572C7.87404 6.86572 7.4707 7.27822 7.4707 7.78239C7.4707 8.28656 7.8832 8.69906 8.38737 8.69906C8.89154 8.69906 9.30404 8.28656 9.30404 7.78239C9.30404 7.27822 8.89154 6.86572 8.38737 6.86572Z"
                fill={currentColor}
            />
            <Path
                d="M19.6718 4.61992C18.9018 2.83242 17.206 1.83325 14.841 1.83325H7.15933C4.21683 1.83325 1.8335 4.21659 1.8335 7.15908V14.8408C1.8335 17.2058 2.83266 18.9016 4.62016 19.6716C4.79433 19.7449 4.996 19.6991 5.12433 19.5708L19.571 5.12409C19.7085 4.98659 19.7543 4.78492 19.6718 4.61992ZM9.65266 11.2199C9.29516 11.5683 8.82766 11.7333 8.36016 11.7333C7.89266 11.7333 7.42516 11.5591 7.06766 11.2199C6.13266 10.3399 5.106 8.93742 5.50016 7.26908C5.8485 5.75658 7.18683 5.07825 8.36016 5.07825C9.5335 5.07825 10.8718 5.75659 11.2202 7.27825C11.6052 8.93742 10.5785 10.3399 9.65266 11.2199Z"
                fill={currentColor}
            />
            <Path
                d="M17.8475 18.8192C18.0492 19.0209 18.0217 19.3509 17.7742 19.4884C16.9675 19.9376 15.9867 20.1667 14.8408 20.1667H7.15915C6.89332 20.1667 6.78332 19.8551 6.96665 19.6717L12.5033 14.1351C12.6867 13.9517 12.9708 13.9517 13.1542 14.1351L17.8475 18.8192Z"
                fill={currentColor}
            />
            <Path
                d="M20.1666 7.15915V14.8408C20.1666 15.9867 19.9374 16.9767 19.4883 17.7742C19.3508 18.0217 19.0208 18.04 18.8191 17.8475L14.1258 13.1542C13.9424 12.9708 13.9424 12.6867 14.1258 12.5033L19.6624 6.96665C19.8549 6.78332 20.1666 6.89332 20.1666 7.15915Z"
                fill={currentColor}
            />
        </Svg>
    );
}
