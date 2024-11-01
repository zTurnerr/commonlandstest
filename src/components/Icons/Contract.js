/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { useTheme } from 'native-base';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function Index({ color, ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...other}>
            <Path
                d="M21.6602 10.44L20.6802 14.62C19.8402 18.23 18.1802 19.69 15.0602 19.39C14.5602 19.35 14.0202 19.26 13.4402 19.12L11.7602 18.72C7.59018 17.73 6.30018 15.67 7.28018 11.49L8.26018 7.30001C8.46018 6.45001 8.70018 5.71001 9.00018 5.10001C10.1702 2.68001 12.1602 2.03001 15.5002 2.82001L17.1702 3.21001C21.3602 4.19001 22.6402 6.26001 21.6602 10.44Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M15.0599 19.3901C14.4399 19.8101 13.6599 20.1601 12.7099 20.4701L11.1299 20.9901C7.15985 22.2701 5.06985 21.2001 3.77985 17.2301L2.49985 13.2801C1.21985 9.3101 2.27985 7.2101 6.24985 5.9301L7.82985 5.4101C8.23985 5.2801 8.62985 5.1701 8.99985 5.1001C8.69985 5.7101 8.45985 6.4501 8.25985 7.3001L7.27985 11.4901C6.29985 15.6701 7.58985 17.7301 11.7599 18.7201L13.4399 19.1201C14.0199 19.2601 14.5599 19.3501 15.0599 19.3901Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M12.6401 8.53003L17.4901 9.76003"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M11.6602 12.3999L14.5602 13.1399"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
