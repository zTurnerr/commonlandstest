import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function Send({ color = 'black', width = '20', height = '20' }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M18.2063 10.0001L9.03723 10.0001M5.17345 13.2356H3.40753M5.17345 10.1137H1.6665M5.17345 6.99184H3.40753M8.27326 4.25429L17.889 9.24174C18.4812 9.54888 18.4812 10.4513 17.8891 10.7585L8.27326 15.7459C7.61452 16.0876 6.91433 15.3673 7.20777 14.6498L8.97118 10.3379C9.05925 10.1226 9.05925 9.87765 8.97118 9.6623L7.20777 5.35046C6.91434 4.63296 7.61452 3.91262 8.27326 4.25429Z"
                stroke={currentColor}
                strokeLinecap="round"
            />
        </Svg>
    );
}
