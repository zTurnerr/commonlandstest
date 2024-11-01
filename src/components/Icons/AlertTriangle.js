import React from 'react';
import Svg, { Path } from 'react-native-svg';

const AlertTriangle = ({ width = '32', height = '32', ...other }) => {
    return (
        <Svg width={width} height={height} fill="none" {...other}>
            <Path
                stroke="#E16453"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 17.2v-5.981m0 10.414v.052m7.56 4.981H8.44a4.531 4.531 0 0 1-4.356-3.232c-.235-.797.053-1.628.493-2.335l7.56-13.631c1.771-2.847 5.955-2.847 7.726 0l7.56 13.631c.44.707.728 1.538.494 2.335a4.531 4.531 0 0 1-4.357 3.232Z"
            />
        </Svg>
    );
};

export default AlertTriangle;
