import { useTheme } from 'native-base';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const Setting = ({ color = '#5EC4AC', width = '20', height = '20', ...other }) => {
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
            <Path
                stroke={currentColor}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.5}
                d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
            />
            <Path
                stroke={currentColor}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.5}
                d="M1.667 10.733V9.267c0-.867.708-1.584 1.583-1.584 1.509 0 2.125-1.066 1.367-2.375A1.583 1.583 0 0 1 5.2 3.15l1.442-.825c.658-.392 1.508-.158 1.9.5l.092.158c.75 1.309 1.983 1.309 2.741 0l.092-.158c.392-.658 1.242-.892 1.9-.5l1.442.825a1.583 1.583 0 0 1 .583 2.158c-.758 1.309-.142 2.375 1.367 2.375.866 0 1.583.709 1.583 1.584v1.466c0 .867-.708 1.584-1.583 1.584-1.509 0-2.125 1.066-1.367 2.375a1.58 1.58 0 0 1-.583 2.158l-1.442.825c-.658.392-1.508.158-1.9-.5l-.092-.158c-.75-1.309-1.983-1.309-2.741 0l-.092.158c-.392.658-1.242.892-1.9.5L5.2 16.85a1.582 1.582 0 0 1-.583-2.158c.758-1.309.142-2.375-1.367-2.375a1.588 1.588 0 0 1-1.583-1.584Z"
            />
        </Svg>
    );
};
export default Setting;
