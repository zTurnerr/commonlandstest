import { useTheme } from 'native-base';
import React from 'react';
import { ClipPath, Defs, G, Path, Rect, Svg } from 'react-native-svg';

export default function Success({ color = 'white', width = '16', height = '16' }) {
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
            <G clip-path="url(#clip0_3973_16155)">
                <Path
                    d="M8.00033 15.3333C12.0504 15.3333 15.3337 12.0501 15.3337 8C15.3337 3.94992 12.0504 0.666672 8.00033 0.666672C3.95024 0.666672 0.666992 3.94992 0.666992 8C0.666992 12.0501 3.95024 15.3333 8.00033 15.3333ZM7.37132 10.9804L4.86226 8.47135L5.80507 7.52854L7.29601 9.01948L10.8275 4.89942L11.8398 5.76714L7.37132 10.9804Z"
                    fill={currentColor}
                />
            </G>
            <Defs>
                <ClipPath id="clip0_3973_16155">
                    <Rect width="16" height="16" fill={currentColor} />
                </ClipPath>
            </Defs>
        </Svg>
    );
}
