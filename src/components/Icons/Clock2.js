import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function Clock2({ color = 'black', width = '18', height = '18' }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M14.6285 9C14.6285 12.7279 11.6056 15.75 7.87675 15.75C4.14786 15.75 1.125 12.7279 1.125 9C1.125 5.27208 4.14786 2.25 7.87675 2.25C10.3759 2.25 12.5578 3.60742 13.7252 5.625M12.7763 9.74074L14.4642 8.05324L16.1522 9.74074M10.4062 10.8406L7.875 9.99685V6.46875"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
