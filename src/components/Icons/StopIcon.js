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
                d="M10 1.25C5.16797 1.25 1.25 5.16797 1.25 10C1.25 14.832 5.16797 18.75 10 18.75C14.832 18.75 18.75 14.832 18.75 10C18.75 5.16797 14.832 1.25 10 1.25ZM14.5859 15.6348L4.36523 5.41406C4.67773 5.0293 5.0293 4.67773 5.41406 4.36523L15.6348 14.5859C15.3223 14.9687 14.9707 15.3223 14.5859 15.6348Z"
                fill={currentColor}
            />
        </Svg>
    );
}
