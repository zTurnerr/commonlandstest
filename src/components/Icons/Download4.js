import { Path, Svg } from 'react-native-svg';
import React from 'react';
import { useTheme } from 'native-base';

export default function Download4({ color = '#5EC4AC', width = '16', height = '18' }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 16 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M1.33325 11.6703L1.33325 14.7438C1.33325 15.2095 1.50885 15.6562 1.82141 15.9856C2.13397 16.315 2.55789 16.5 2.99992 16.5H12.9999C13.4419 16.5 13.8659 16.315 14.1784 15.9856C14.491 15.6562 14.6666 15.2095 14.6666 14.7438V11.6703M8.00085 1.5V11.4521M8.00085 11.4521L11.8104 7.64941M8.00085 11.4521L4.19132 7.64941"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
