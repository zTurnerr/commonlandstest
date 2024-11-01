import { useTheme } from 'native-base';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const CheckCircle = ({ color = '#fff', width = 20, height = 20, ...other }) => {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;

    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            fill="none"
            viewBox="0 0 20 20"
            {...other}
        >
            <Path
                stroke={currentColor}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.5 10a7.5 7.5 0 1 1-4.219-6.746m2.813 2.058L9.53 11.875 7.656 10"
            />
        </Svg>
    );
};
export default CheckCircle;
