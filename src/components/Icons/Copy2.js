import { useTheme } from 'native-base';
import React from 'react';
import { G, Path, Rect, Svg } from 'react-native-svg';

export default function Copy2({ color = '#5EC4AC', width = '16', height = '16' }) {
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
            <G id="general/copy">
                <Rect
                    id="Rectangle 1445"
                    x="2.5"
                    y="3.5"
                    width="9"
                    height="10"
                    rx="1.5"
                    stroke={currentColor}
                />
                <Rect
                    id="Rectangle 1448"
                    x="5"
                    y="6"
                    width="4"
                    height="1"
                    rx="0.5"
                    fill={currentColor}
                />
                <Rect
                    id="Rectangle 1449"
                    x="5"
                    y="8"
                    width="4"
                    height="1"
                    rx="0.5"
                    fill={currentColor}
                />
                <Rect
                    id="Rectangle 1450"
                    x="5"
                    y="10"
                    width="4"
                    height="1"
                    rx="0.5"
                    fill={currentColor}
                />
                <Path
                    id="Union"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.0017 2H11.5998C12.373 2 12.9998 2.6268 12.9998 3.4V3.91081C13.0011 3.94038 13.0017 3.97011 13.0017 4V11.5482C13.6063 11.1124 13.9998 10.4021 13.9998 9.6V3.4C13.9998 2.07452 12.9253 1 11.5998 1H6.39978C5.59677 1 4.88587 1.39437 4.4502 2H6.39978H11.0017Z"
                    fill={currentColor}
                />
            </G>
        </Svg>
    );
}
