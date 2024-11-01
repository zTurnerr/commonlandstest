import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function BorderTrash({ width = '16', height = '16' }) {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M13.3996 4.38801C11.4016 4.19001 9.39161 4.08801 7.38761 4.08801C6.19961 4.08801 5.01161 4.14801 3.82361 4.26801L2.59961 4.38801"
                stroke="#292D32"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M5.89941 3.782L6.03141 2.996C6.12741 2.426 6.19941 2 7.21341 2H8.78541C9.79941 2 9.87741 2.45 9.96741 3.002L10.0994 3.782"
                stroke="#292D32"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M12.1096 6.28406L11.7196 12.3261C11.6536 13.2681 11.5996 14.0001 9.92565 14.0001H6.07365C4.39965 14.0001 4.34565 13.2681 4.27965 12.3261L3.88965 6.28406"
                stroke="#292D32"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M6.99805 10.7001H8.99605"
                stroke="#292D32"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M6.5 8.30005H9.5"
                stroke="#292D32"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
