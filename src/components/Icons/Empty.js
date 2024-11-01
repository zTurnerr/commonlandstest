import * as React from 'react';
import Svg, { Path, G, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const Empty = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={98} height={98} fill="none" {...props}>
        <Path
            fill="#EFEFEF"
            d="M49 98c27.062 0 49-21.938 49-49S76.062 0 49 0 0 21.938 0 49s21.938 49 49 49Z"
        />
        <G filter="url(#a)">
            <Path
                fill="url(#b)"
                d="M31.125 26a3 3 0 0 1 3-3h18.087a3 3 0 0 1 2.313 1.09l12.663 15.328a3 3 0 0 1 .687 1.91V68a3 3 0 0 1-3 3h-30.75a3 3 0 0 1-3-3V26Z"
            />
            <Path
                stroke="url(#c)"
                d="M31.625 26a2.5 2.5 0 0 1 2.5-2.5h18.087a2.5 2.5 0 0 1 1.927.908l12.663 15.329a2.5 2.5 0 0 1 .573 1.592V68a2.5 2.5 0 0 1-2.5 2.5h-30.75a2.5 2.5 0 0 1-2.5-2.5V26Z"
            />
        </G>
        <G filter="url(#d)">
            <Path fill="url(#e)" d="M60.375 31.118 52.875 23v14.25a3 3 0 0 0 3 3h12l-7.5-9.132Z" />
            <Path
                stroke="url(#f)"
                strokeWidth={0.5}
                d="M67.346 40H55.875a2.75 2.75 0 0 1-2.75-2.75V23.639l7.061 7.643L67.346 40Z"
            />
        </G>
        <Rect width={21} height={3} x={38.625} y={53.75} fill="#C9C9CC" rx={1.5} />
        <Rect width={12} height={3} x={43.125} y={47.75} fill="#000" rx={1.5} />
        <Defs>
            <LinearGradient
                id="b"
                x1={49.5}
                x2={49.5}
                y1={23}
                y2={71}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#fff" />
                <Stop offset={1} stopColor="#EFEFEF" />
            </LinearGradient>
            <LinearGradient
                id="c"
                x1={49.125}
                x2={49.125}
                y1={71}
                y2={25.25}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#fff" />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="e"
                x1={51.875}
                x2={59.379}
                y1={40.25}
                y2={41.236}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#FAFAFA" />
                <Stop offset={1} stopColor="#EDEDED" />
            </LinearGradient>
            <LinearGradient
                id="f"
                x1={61.875}
                x2={60.846}
                y1={50.397}
                y2={32.134}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#fff" />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
        </Defs>
    </Svg>
);
export default Empty;
