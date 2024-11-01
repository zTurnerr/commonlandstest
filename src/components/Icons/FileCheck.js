import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function FileCheck({ width = '20', height = '20' }) {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M8.58301 18H4.583C3.47843 17.9999 2.583 17.1045 2.58301 15.9999L2.58309 3.99999C2.58309 2.89542 3.47852 2 4.58308 2H13.5833C14.6879 2 15.5833 2.89543 15.5833 4V9.5M11.5833 15.1667L13.4167 17L17.4167 12.9998M6.08332 6H12.0833M6.08332 9H12.0833M6.08332 12H9.08332"
                stroke="#5EC4AC"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
