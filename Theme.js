import { theme as baseTheme, extendTheme } from 'native-base';
const input = {
    borderRadius: 12,
    borderColor: '#C5C6CC',
    backgroundColor: 'transparent',
    height: 48,
    selectionColor: 'rgba(58, 151, 173, 1)',
    _focus: {
        borderColor: 'rgba(58, 151, 173, 1)',
        backgroundColor: 'transparent',
    },
    _disabled: {
        color: '#C5C6CC',
        backgroundColor: '#F8F9FE',
    },
};
const text = {
    primary: '#000000',
    secondary: 'rgba(113, 114, 122, 1)',
    darkNeutral: '#2F3036',
};

const appColors = {
    primary: '#5EC4AC',
    bgPrimary: 'rgba(94, 196, 172, 0.10)',
    white: '#fff',
    black: '#000',
    textGrey: 'rgba(0, 0, 0, 0.60)',
    bgGrey: 'rgba(0, 0, 0, 0.08)',
    primaryGreen: '#267385',
    primaryRed: '#E16453',
    primaryRedPressed: 'rgba(225, 100, 83, 0.5)',
    outlinePrimaryRedPressed: 'rgba(225, 100, 83, 0.1)',
    secondaryGreen: '#2AB848',
    primaryYellow: '#FABD3A', // rgba(250, 189, 58, 1)
    secondaryYellow: '#FFF6C6',
    dotYellow: '#564F13',
    bgYellow: 'rgba(250, 189, 58, 0.10)',
    primaryBlue: '#61C7DF',
    bgGray: '#F5F5F5',
    seconDaryGray: '#F4F4F4',
    borderGrey: 'rgba(0, 0, 0, 0.08)',
    bgBlue: 'rgba(97, 199, 223, 0.10)',
    divider: 'rgba(0, 0, 0, 0.1)',
    transparent: 'transparent',
    bgSecondaryYellow: 'rgba(255, 246, 198, 1)',
    neuTralGrey: '#0A090B',
    iconYellow: '#DB990B',
    lineColor: 'rgba(0, 0, 0, 0.15)',
    bgLoading: 'rgba(0, 0, 0, 0.8)',
};

const theme = extendTheme({
    components: {
        Button: {
            baseStyle: {
                height: '50px',
                width: '100%',
                borderRadius: '12px',
                _text: {
                    fontWeight: 600,
                },
            },
            sizes: {
                sm: {
                    height: '34px',
                    width: 'auto',
                    px: '16px',
                    py: '8px',
                    _text: {
                        fontSize: '12px',
                        lineHeight: '12px',
                        fontWeight: 500,
                    },
                    borderRadius: '8px',
                },
            },
        },
        Input: {
            baseStyle: {
                ...input,
                height: input.height + 'px',
            },
        },
        Text: {
            baseStyle: {
                fontSize: '12px',
                color: text.primary,
            },
        },
    },
    input,
    colors: {
        strength: {
            na: '#AAAAAA',
            veryPoor: '#A6B49A',
            poor: '#A5C28B',
            okay: '#9BD5AB',
            good: '#5FC293',
            veryGood: '#3EB6A7',
        },
        trustScore: {
            na: '#AAAAAA',
            veryPoor: '#A6B49A',
            poor: '#A5C28B',
            good: '#9BD5AB',
            veryGood: '#5FC293',
            excellent: '#3EB6A7',
        },
        backdrop: {
            1: '#313131',
            2: '#CBCBCB',
            3: '#292D32',
            4: 'rgba(0, 0, 0, 0.8)',
        },
        config: {
            initialColorMode: 'light',
        },
        border: {
            1: 'rgba(0, 0, 0, 0.1)',
        },
        muted: {
            300: '#D0D0D0',
            400: '#EEEEEE',
            500: '#606060',
        },
        danger: {
            100: 'rgba(255, 147, 132, 0.15)',
            200: 'rgba(236, 79, 79, 1)', // #EC4F4F
            300: '#FF7D7D',
            400: '#AD1457',
            '400A': 'rgba(173, 20, 87, 0.5)',
            500: '#FE4A3E',
            600: 'rgba(254, 74, 62, 0.10)',
            700: '#DA3B01', // rgba(219, 59, 1, 1)
            800: 'rgba(219, 59, 1, 0.10)',
            900: 'rgba(173, 20, 87, 0.2)', //#AD145333,
            1000: 'rgba(173, 20, 87, 0.10)', //#AD14531A,
            1100: '#FE9B95',
            1200: '#FFF2F2',
            1300: '#D76050',
            1400: '#FFF0EF',
            1500: 'rgba(255, 103, 94, 1)', // #FF675E
            1510: 'rgba(255, 103, 94, 0.1)',
            light: '#FF675E1A', // rgba(255, 103, 94, 0.1)
            1600: 'rgba(253, 70, 70, 1)', // #FD464A
            1700: 'rgba(250, 84, 28, 1)', // #FA541C
            1800: 'rgba(255, 242, 232, 1)', // #FFF2E8
        },
        primary: {
            100: 'rgba(94, 196, 172, 0.08)',
            200: 'rgba(94, 196, 172, 0.1)', // #5EC4AC1A
            300: 'rgba(75, 215, 182, 0.08)',
            500: 'rgba(62, 191, 132, 1)',
            600: 'rgba(94, 196, 172, 1)', //#5EC4AC
            700: 'rgba(15, 149, 101, 1)',
            800: 'rgba(7, 107, 91, 1)',
            900: 'rgba(38, 115, 133, 1)',
            1000: 'rgba(71, 184, 129, 1)', //#47B881
            1100: 'rgba(242, 250, 246, 1)',
            1200: 'rgba(1, 153, 57, 1)', //#019939
            1300: 'rgba(71, 184, 129, 0.2)', //#47B88133
            1400: '#00803A', // rgba(0, 128, 58, 1)
            1500: '#00803A33', // rgba(0, 128, 58, 0.1)
            1600: '#016626',
            1700: '#E1FAEA',
            1800: '#61C7DF1A',
        },
        yellow: {
            100: '#EAA300',
            200: '#FABD3A33',
            300: '#FFF9F5',
            400: '#FFC329',
            500: '#FFD874',
            600: '#936312',
            700: '#FABD3A',
            710: '#FABD3A10',
            800: '#FABD3A1A',
            900: '#FFEFCB', // rgba(255, 239, 203, 1)
            1000: '#AC9054',
            1200: '#FEF8EC',
            1300: '#FFEFCB',
            1400: '#8A681E',
            1500: '#7B5706', // rgba(123, 86, 6, 1)
            1600: '#FFE8B6',
            1700: 'rgba(250, 140, 22, 1)', // #FA8C16
            1800: 'rgba(255, 247, 230, 1)', // #FFF7E6
        },
        brown: {
            100: '#7B5605',
        },
        buttonError: {
            ...baseTheme.colors.error,
            100: '#E1645310',
            200: '#E1645330',
            300: '#E1645350',
            400: '#E1645370',
            500: '#E1645390',
            600: '#E16453',
        },
        buttonPrimary: {
            bgColor: {
                linearGradient: {
                    colors: ['rgba(95, 196, 172, 1)', 'rgba(52, 119, 189, 1)'],
                    start: [0, 0],
                    end: [1, 0],
                },
            },
            color: 'white',
        },
        gray: {
            100: '#F5F5F5',
            200: '#F6F6F6',
            300: '#9B9B9B',
            400: 'rgba(0, 0, 0, 0.15)',
            500: 'rgba(97, 97, 97, 1)',
            600: 'rgba(127, 125, 131, 1)', // #7F7D83
            610: 'rgba(127, 125, 131, 0.1)',
            700: 'rgba(0, 0, 0, 0.6)', // #00000099
            800: 'rgba(79, 77, 85, 1)', // #4F4D55
            900: 'rgba(0, 0, 0, 0.65)', //#000000A6
            1000: 'rgba(201, 201, 204, 1)', //#C9C9CC
            1100: 'rgba(248, 248, 248, 1)', //#F8F8F8
            1200: 'rgba(236, 236, 237, 1)', //#ECECED
            1300: 'rgb(142, 142, 142)', //#8E8E8E
            1400: 'rgba(0, 0, 0, 0.1)', //#0000001A
            1500: 'rgba(244, 244, 244, 1)', //#F4F4F4
            1600: 'rgba(0, 0, 0, 0.05)',
            1700: 'rgba(230, 230, 230, 1)', //#E6E6E6
            1800: 'rgba(105, 112, 119, 1)', //#697077
            1900: '#3D3D3D',
            2000: 'rgba(223, 223, 223, 1)', //#DFDFDF
            2100: '#DCDCDE',
            2200: '#F2F2F2', // rgba(242, 242, 242, 1)
            2300: 'rgba(0, 0, 0, 0.3)',
            2310: 'rgba(243, 243, 243, 1)', // #F3F3F3
            2320: '#B9B9B9', // rgba(185, 185, 185, 1),
            2400: '#4F4F4F',
            2500: '#F8F9FA',
            2600: '#696969',
            2700: '#6A8390',
            2800: '#EDF6FB',
        },
        pink: {
            300: 'rgba(255, 185, 6, 0.1)',
            400: '#FFB906',
        },
        buttonSecondary: {
            bgColor: 'white',
            color: 'black',
        },
        loading: {
            300: 'rgb(122, 129, 137)',
        },
        divider: 'rgba(0, 0, 0, 0.2)',
        link: 'rgba(58, 151, 173, 1)',
        text,
        appColors,
        blue: {
            ...baseTheme.colors.blue,
            100: '#267385',
            200: '#267385',
            300: '#267385',
            400: '#267385',
            500: '#267385',
            600: '#267385',
            700: '#267385',
            800: '#267385',
            900: '#267385',
            1000: 'rgba(82, 100, 164, 1)', // #5264A4
        },
    },
});

export default theme;
