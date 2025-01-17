import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function Trash({ color, width = '20', height = '20' }) {
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
                d="M3.33301 5.14706L16.6663 5.14706M13.333 17.5H6.66634C5.74587 17.5 4.99967 16.7099 4.99967 15.7353V6.02941C4.99967 5.5421 5.37277 5.14706 5.83301 5.14706H14.1663C14.6266 5.14706 14.9997 5.5421 14.9997 6.02941V15.7353C14.9997 16.7099 14.2535 17.5 13.333 17.5ZM8.33301 5.14706H11.6663C12.1266 5.14706 12.4997 4.75202 12.4997 4.26471V3.38235C12.4997 2.89504 12.1266 2.5 11.6663 2.5H8.33301C7.87277 2.5 7.49967 2.89504 7.49967 3.38235V4.26471C7.49967 4.75202 7.87277 5.14706 8.33301 5.14706Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </Svg>
    );
}
