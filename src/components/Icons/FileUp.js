import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function FileUp({ width = '20', height = '20' }) {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M9 18H4.99999C3.89542 17.9999 2.99999 17.1045 3 15.9999L3.00008 3.99999C3.00008 2.89542 3.89551 2 5.00008 2H14.0003C15.1049 2 16.0003 2.89543 16.0003 4V9.5M13.0003 15.0355L15.0455 13M15.0455 13L17.0003 14.9435M15.0455 13V18M6.50031 6H12.5003M6.50031 9H12.5003M6.50031 12H9.50031"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
