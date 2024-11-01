import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const InfoCircle = ({ width = '20', height = '20', color = 'black' }) => {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none">
            <Circle cx={10} cy={10} r={8.75} fill={color} />
            <Path stroke="#fff" strokeLinecap="round" strokeWidth={1.8} d="M10 14.25V10.5" />
            <Circle cx={10} cy={6.375} r={1.375} fill="#fff" transform="rotate(-180 10 6.375)" />
        </Svg>
    );
};
export default InfoCircle;
