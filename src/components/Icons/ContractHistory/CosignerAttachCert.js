import React from 'react';
import { Path, Rect, Svg } from 'react-native-svg';

export default function CosignerAttachCert({}) {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none">
            <Rect width={24} height={24} fill="#5EC4AC" rx={12} />
            <Path fill="#fff" d="M12 10.999a3.333 3.333 0 1 0 0-6.667 3.333 3.333 0 0 0 0 6.667Z" />
            <Path
                fill="#fff"
                d="M12 12.668c-3.34 0-6.06 2.24-6.06 5a.33.33 0 0 0 .333.333h11.453a.33.33 0 0 0 .334-.333c0-2.76-2.72-5-6.06-5Z"
                opacity={0.4}
            />
            <Path
                fill="#fff"
                d="M18.286 12.826c-.6-.6-1.073-.406-1.48 0l-2.36 2.36a.821.821 0 0 0-.2.394l-.127.9c-.046.326.18.553.507.506l.9-.126a.793.793 0 0 0 .393-.2l2.36-2.36c.414-.4.607-.874.007-1.474Z"
            />
        </Svg>
    );
}
