import { useTheme } from 'native-base';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const Loading = ({ color = '#DB990B', width = '20', height = '20', ...other }) => {
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
                strokeWidth={1.5}
                d="M10 5.929V2.5m0 15v-3.429M14.071 10H17.5m-15 0h3.429m6.95-2.879 2.425-2.424M4.696 15.303l2.425-2.424m5.758 0 2.425 2.424M4.696 4.697 7.121 7.12"
            />
        </Svg>
    );
};
export default Loading;
