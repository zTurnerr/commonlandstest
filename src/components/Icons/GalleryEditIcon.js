import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function Index({ color, width = '20', height = '20', ...other }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...other}
        >
            <Path
                d="M7.49967 8.33333C8.42015 8.33333 9.16634 7.58714 9.16634 6.66667C9.16634 5.74619 8.42015 5 7.49967 5C6.5792 5 5.83301 5.74619 5.83301 6.66667C5.83301 7.58714 6.5792 8.33333 7.49967 8.33333Z"
                stroke={currentColor}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M10.8337 1.66726H7.50033C3.33366 1.66726 1.66699 3.33393 1.66699 7.50059V12.5006C1.66699 16.6673 3.33366 18.3339 7.50033 18.3339H12.5003C16.667 18.3339 18.3337 16.6673 18.3337 12.5006V8.33393"
                stroke={currentColor}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M15.9501 2.15961L12.9251 5.18461C12.8084 5.30127 12.6917 5.52627 12.6751 5.69294L12.5084 6.85128C12.4501 7.26794 12.7417 7.55961 13.1584 7.50127L14.3167 7.33461C14.4751 7.30961 14.7084 7.20127 14.8251 7.08461L17.8501 4.05961C18.3751 3.53461 18.6167 2.93461 17.8501 2.16794C17.0751 1.38461 16.4751 1.63461 15.9501 2.15961Z"
                stroke={currentColor}
                stroke-miterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M15.5166 2.59055C15.7749 3.50722 16.4916 4.22389 17.4083 4.48222"
                stroke={currentColor}
                stroke-miterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M2.22461 15.792L6.33294 13.0336C6.99128 12.592 7.94128 12.642 8.53294 13.1503L8.80794 13.392C9.45794 13.9503 10.5079 13.9503 11.1579 13.392L14.6246 10.417C15.2746 9.85864 16.3246 9.85864 16.9746 10.417L18.3329 11.5836"
                stroke={currentColor}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
