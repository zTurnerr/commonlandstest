import { useTheme } from 'native-base';
import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

export default function Index({ color, width = '24', height = '24' }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <G id="vuesax/linear/user-octagon">
                <G id="user-octagon">
                    <Path
                        id="Vector"
                        d="M21.0802 8.58003V15.42C21.0802 16.54 20.4802 17.58 19.5102 18.15L13.5702 21.58C12.6002 22.14 11.4002 22.14 10.4202 21.58L4.48016 18.15C3.51016 17.59 2.91016 16.55 2.91016 15.42V8.58003C2.91016 7.46003 3.51016 6.41999 4.48016 5.84999L10.4202 2.42C11.3902 1.86 12.5902 1.86 13.5702 2.42L19.5102 5.84999C20.4802 6.41999 21.0802 7.45003 21.0802 8.58003Z"
                        stroke={currentColor}
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <G id="Group">
                        <Path
                            id="Vector_2"
                            d="M11.9999 10.9998C13.2867 10.9998 14.3299 9.95662 14.3299 8.6698C14.3299 7.38298 13.2867 6.33984 11.9999 6.33984C10.7131 6.33984 9.66992 7.38298 9.66992 8.6698C9.66992 9.95662 10.7131 10.9998 11.9999 10.9998Z"
                            stroke={currentColor}
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <Path
                            id="Vector_3"
                            d="M16 16.6594C16 14.8594 14.21 13.3994 12 13.3994C9.79 13.3994 8 14.8594 8 16.6594"
                            stroke={currentColor}
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </G>
                </G>
            </G>
        </Svg>
    );
}
