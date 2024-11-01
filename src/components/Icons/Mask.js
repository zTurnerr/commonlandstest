import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function Mask({ color = 'white', width = '18', height = '18' }) {
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
                d="M16.4784 9.00094C16.4784 11.2059 15.5184 13.2009 13.9884 14.5584C12.6684 15.7584 10.9209 16.4784 9.00094 16.4784C4.87594 16.4784 1.52344 13.1259 1.52344 9.00094C1.52344 4.87594 4.87594 1.52344 9.00094 1.52344C10.9209 1.52344 12.6684 2.24344 13.9884 3.44344C15.5184 4.80094 16.4784 6.79594 16.4784 9.00094Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M8.97844 12.2922C8.96344 13.5297 8.04094 13.8297 7.17844 13.4847C5.40094 12.7722 4.14844 11.0322 4.14844 8.99969C4.14844 6.96719 5.40094 5.22719 7.17844 4.50719C8.04094 4.16219 8.96344 4.46969 8.97844 5.69969V12.2922Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
