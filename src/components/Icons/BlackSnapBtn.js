import * as React from 'react';
import Svg, { G, Rect, Path, Defs } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const BlackSnapBtn = ({ bg = '#5EC4AC' }) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={64} height={64} fill="none">
        <G filter="url(#a)">
            <Rect width={56} height={56} x={4} y={4} fill={bg} rx={28} />
        </G>
        <Path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M26.76 42h10.48c2.76 0 3.86-1.69 3.99-3.75l.52-8.26A3.753 3.753 0 0 0 38 26c-.61 0-1.17-.35-1.45-.89l-.72-1.45c-.46-.91-1.66-1.66-2.68-1.66h-2.29c-1.03 0-2.23.75-2.69 1.66l-.72 1.45c-.28.54-.84.89-1.45.89-2.17 0-3.89 1.83-3.75 3.99l.52 8.26C22.89 40.31 24 42 26.76 42ZM30.5 28h3"
        />
        <Path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M32 38c1.79 0 3.25-1.46 3.25-3.25S33.79 31.5 32 31.5s-3.25 1.46-3.25 3.25S30.21 38 32 38Z"
        />
        <Defs></Defs>
    </Svg>
);
export default BlackSnapBtn;
