import { useTheme } from 'native-base';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function Index({ color = 'white' }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
        >
            <Path
                d="M4 20.3827C4.40471 20.778 4.95361 21 5.52595 21H18.4741C19.0464 21 19.5953 20.778 20 20.3827M12.0012 3V14.9425M12.0012 14.9425L16.9338 10.3793M12.0012 14.9425L7.06859 10.3793"
                stroke={currentColor}
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </Svg>
    );
}
