import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function FilledTrash({ color = '#FF7D7D', width = '40', height = '40' }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M35.1168 8.71659C32.4334 8.44992 29.7501 8.24992 27.0501 8.09992V8.08325L26.6834 5.91659C26.4334 4.38325 26.0668 2.08325 22.1668 2.08325H17.8001C13.9168 2.08325 13.5501 4.28325 13.2834 5.89992L12.9334 8.03325C11.3834 8.13325 9.83343 8.23325 8.28343 8.38325L4.88343 8.71659C4.18343 8.78325 3.68343 9.39992 3.7501 10.0833C3.81677 10.7666 4.41677 11.2666 5.11677 11.1999L8.51677 10.8666C17.2501 9.99992 26.0501 10.3333 34.8834 11.2166C34.9334 11.2166 34.9668 11.2166 35.0168 11.2166C35.6501 11.2166 36.2001 10.7333 36.2668 10.0833C36.3168 9.39992 35.8168 8.78325 35.1168 8.71659Z"
                fill={currentColor}
            />
            <Path
                d="M32.0499 13.5667C31.6499 13.1501 31.0999 12.9167 30.5332 12.9167H9.46657C8.89991 12.9167 8.33324 13.1501 7.94991 13.5667C7.56657 13.9834 7.34991 14.5501 7.38324 15.1334L8.41658 32.2334C8.59991 34.7667 8.83324 37.9334 14.6499 37.9334H25.3499C31.1666 37.9334 31.3999 34.7834 31.5832 32.2334L32.6166 15.1501C32.6499 14.5501 32.4332 13.9834 32.0499 13.5667ZM22.7666 29.5834H17.2166C16.5332 29.5834 15.9666 29.0167 15.9666 28.3334C15.9666 27.6501 16.5332 27.0834 17.2166 27.0834H22.7666C23.4499 27.0834 24.0166 27.6501 24.0166 28.3334C24.0166 29.0167 23.4499 29.5834 22.7666 29.5834ZM24.1666 22.9167H15.8332C15.1499 22.9167 14.5832 22.3501 14.5832 21.6667C14.5832 20.9834 15.1499 20.4167 15.8332 20.4167H24.1666C24.8499 20.4167 25.4166 20.9834 25.4166 21.6667C25.4166 22.3501 24.8499 22.9167 24.1666 22.9167Z"
                fill={currentColor}
            />
        </Svg>
    );
}
