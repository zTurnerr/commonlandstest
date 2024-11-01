import { useTheme } from 'native-base';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const Danger = ({ color = '#FF675E', width = '40', height = '40', ...other }) => {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 40 40"
            fill="none"
            {...other}
        >
            <Path
                stroke={currentColor}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 15v8.333M20 35.687H9.9c-5.784 0-8.2-4.134-5.4-9.184l5.2-9.366 4.9-8.8c2.966-5.35 7.833-5.35 10.8 0l4.9 8.816 5.2 9.367c2.8 5.05.366 9.183-5.4 9.183H20v-.016ZM19.99 28.332h.015"
            />
        </Svg>
    );
};
export default Danger;
