import * as React from 'react';
import Svg, { Defs, G, Path, Rect } from 'react-native-svg';

/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SnapButton = (
    {
        // color = '#5EC4AC'
    },
) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={76} height={76} fill="none">
        <G filter="url(#a)">
            <Rect width={68} height={68} x={4} y={4} fill="#fff" rx={34} />
            <Rect width={64} height={64} x={6} y={6} stroke="#000" strokeWidth={4} rx={32} />
        </G>
        <Path
            fill="#5EC4AC"
            d="M40.804 24.645c1.162 0 2.238.61 2.827 1.603l1.187 2.003h3.017c2.615 0 4.736 2.101 4.736 4.694v13.72c0 2.592-2.12 4.694-4.736 4.694H28.163c-2.615 0-4.735-2.102-4.735-4.694v-13.72c0-2.593 2.12-4.694 4.735-4.694h3.032l1.274-2.057a3.285 3.285 0 0 1 2.794-1.55h5.54Zm0 2.166h-5.54c-.326 0-.632.144-.838.387l-.094.13-1.594 2.573c-.2.32-.552.516-.932.516h-3.643c-1.408 0-2.55 1.132-2.55 2.528v13.72c0 1.396 1.142 2.527 2.55 2.527h19.672c1.408 0 2.55-1.131 2.55-2.527v-13.72c0-1.396-1.142-2.528-2.55-2.528h-3.643c-.388 0-.746-.203-.942-.534l-1.504-2.537a1.095 1.095 0 0 0-.942-.535Zm-2.805 5.773c3.622 0 6.557 2.91 6.557 6.499 0 3.589-2.935 6.499-6.557 6.499-3.621 0-6.557-2.91-6.557-6.5 0-3.589 2.936-6.498 6.557-6.498Zm0 2.166c-2.414 0-4.371 1.94-4.371 4.333 0 2.393 1.957 4.332 4.371 4.332 2.414 0 4.372-1.94 4.372-4.332 0-2.393-1.958-4.333-4.372-4.333Z"
        />
        <Defs></Defs>
    </Svg>
);
export default SnapButton;
