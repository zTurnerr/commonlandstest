import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function Note2Outline({ color, width = '14', height = '14' }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M12.6349 6.09005L12.0633 8.52838C11.5733 10.6342 10.6049 11.4859 8.78494 11.3109C8.49328 11.2875 8.17828 11.235 7.83994 11.1534L6.85994 10.92C4.42744 10.3425 3.67494 9.14088 4.24661 6.70255L4.81828 4.25838C4.93494 3.76255 5.07494 3.33088 5.24994 2.97505C5.93244 1.56338 7.09328 1.18421 9.04161 1.64505L10.0158 1.87255C12.4599 2.44421 13.2066 3.65171 12.6349 6.09005Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M8.7852 11.3109C8.42353 11.5559 7.96853 11.7601 7.41437 11.9409L6.4927 12.2443C4.17687 12.9909 2.9577 12.3668 2.2052 10.0509L1.45853 7.74676C0.711866 5.43093 1.3302 4.20593 3.64603 3.45926L4.5677 3.15593C4.80687 3.0801 5.03437 3.01593 5.2502 2.9751C5.0752 3.33093 4.9352 3.7626 4.81853 4.25843L4.24687 6.7026C3.6752 9.14093 4.4277 10.3426 6.8602 10.9201L7.8402 11.1534C8.17853 11.2351 8.49353 11.2876 8.7852 11.3109Z"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M7.37354 4.97583L10.2027 5.69333"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M6.80176 7.2334L8.49342 7.66507"
                stroke={currentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
