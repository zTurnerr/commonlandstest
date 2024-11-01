import { Path, Svg } from 'react-native-svg';
import React from 'react';
import { useTheme } from 'native-base';

export default function Download3({ color = '#5EC4AC', width = '16', height = '16' }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M1.66675 9.13626L1.66675 11.595C1.66675 11.9676 1.80722 12.325 2.05727 12.5885C2.30732 12.852 2.64646 13 3.00008 13H11.0001C11.3537 13 11.6928 12.852 11.9429 12.5885C12.1929 12.325 12.3334 11.9676 12.3334 11.595V9.13626M7.00082 1V8.96164M7.00082 8.96164L10.0484 5.91953M7.00082 8.96164L3.95321 5.91953"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
