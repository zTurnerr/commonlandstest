import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function Upload({ color = '#4F4D55', width = '20', height = '20' }) {
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
                d="M3.33301 12.6703V15.7437C3.33301 16.2095 3.5086 16.6562 3.82116 16.9856C4.13372 17.315 4.55765 17.5 4.99967 17.5H14.9997C15.4417 17.5 15.8656 17.315 16.1782 16.9856C16.4907 16.6562 16.6663 16.2095 16.6663 15.7437V12.6703M10.0003 12.4521L10.0003 2.5M10.0003 2.5L6.19077 6.30265M10.0003 2.5L13.8098 6.30265"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
