import { useTheme } from 'native-base';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const CancelRight = ({ color = '#fff', ...other }) => {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" {...other}>
            <Path
                stroke={currentColor}
                strokeLinecap="round"
                strokeWidth={2}
                d="m7.188 12.813 5.625-5.626M10 17.5a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                opacity={0.9}
            />
        </Svg>
    );
};
export default CancelRight;
