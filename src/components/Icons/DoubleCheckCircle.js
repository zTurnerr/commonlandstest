import { useTheme } from 'native-base';
import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const DoubleCheckCircle = ({ color = '#fff', width = '20', height = '20', ...other }) => {
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
            <Circle cx={10} cy={10} r={8.25} stroke={currentColor} strokeWidth={1.5} />
            <Path
                stroke={currentColor}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="m11.5 7.5-4 5.5-3-2.5M15 7l-4 5.5L9 11"
            />
        </Svg>
    );
};
export default DoubleCheckCircle;
