import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Bookmark2, Notepad2 } from 'iconsax-react-native';
import { Box, Text, useDisclose, useTheme } from 'native-base';
import React, { createContext, useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Explore } from '../../components/Icons';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import ContractC from '../Contract';
import Map from '../Explore';
import Noti from '../Notifications';
import Plots from '../Plots';
import ModalFoundOfflinePlot from './ModalFoundOfflinePlot';
import ModalLimitCreatePlot from './ModalLimitCreatePlot';
import ModalRequiredLogin from './ModalRequiredLogin';
import NotificationsButton from './NotificationButton';
import QuickActions from './QuickActions';
import styles from './styles';

export const ModalContext = createContext();

function reducer(state, action) {
    let countLoading = state.countLoading;

    switch (action.type) {
        case 'open':
            return { ...state, isOpen: true };
        case 'close':
            return { ...state, isOpen: false };
        case 'openLimitCreatePlot':
            return { ...state, isOpenLimitCreatePlot: true };
        case 'closeLimitCreatePlot':
            return { ...state, isOpenLimitCreatePlot: false };
        case 'fetchingPlots':
            countLoading++;
            return { ...state, isFetchingPlots: !!countLoading, countLoading };
        case 'fetchedPlots':
            countLoading--;
            return { ...state, isFetchingPlots: !!countLoading, countLoading };
        default:
            return state;
    }
}

const TabLabel = ({ color, focused, children }) => {
    const { colors } = useTheme();
    return (
        <Text color={focused ? colors.primary[600] : color} fontSize="10px">
            {children}
        </Text>
    );
};

const Tab = createBottomTabNavigator();

export default function Main() {
    const [state, dispatch] = useReducer(reducer, {
        isOpen: false,
        isOpenLimitCreatePlot: false,
        isFetchingPlots: false,
        countLoading: 0,
    });
    const { colors } = useTheme();
    const colorFocus = colors.primary[600];
    const { isOpen, onOpen, onClose } = useDisclose();
    const onCloseModal = () => dispatch({ type: 'close' });
    const onOpenModal = () => dispatch({ type: 'open' });
    const onCloseModalLimitCreatePlot = () => dispatch({ type: 'closeLimitCreatePlot' });
    const onOpenModalLimitCreatePlot = () => dispatch({ type: 'openLimitCreatePlot' });

    const { user } = useShallowEqualSelector((state) => ({
        user: state.user,
    }));
    const { isLogged } = user;
    const { t } = useTranslation();

    return (
        <ModalContext.Provider
            value={{
                state,
                onCloseModal,
                onOpenModal,
                onCloseModalLimitCreatePlot,
                onOpenModalLimitCreatePlot,
            }}
        >
            <Tab.Navigator
                initialRouteName="Explore"
                screenOptions={{
                    tabBarStyle: { height: 66, paddingBottom: 6 },
                    tabBarButton: (props) => <TouchableOpacity {...props} />,
                }}
            >
                <Tab.Screen
                    name="Explore"
                    component={Map}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => {
                            return (
                                <Explore filled={focused} color={focused ? colorFocus : color} />
                            );
                        },
                        tabBarLabel: (props) => {
                            return <TabLabel {...props}>{t('bottomTab.explore')}</TabLabel>;
                        },
                    }}
                />
                <Tab.Screen
                    name="Contract"
                    component={ContractC}
                    options={{
                        unmountOnBlur: true,
                        headerShown: false,
                        tabBarLabel: (props) => {
                            return <TabLabel {...props}>{t('components.contract')}</TabLabel>;
                        },
                        tabBarIcon: ({ color, focused }) => {
                            return (
                                <Notepad2
                                    color={focused ? colorFocus : color}
                                    variant={focused ? 'Bold' : 'Outline'}
                                />
                            );
                        },
                    }}
                    listeners={{
                        tabPress: (e) => {
                            if (!isLogged) {
                                e.preventDefault();
                                return onOpenModal();
                            }
                        },
                    }}
                />
                <Tab.Screen
                    name="Create"
                    component={Map}
                    options={{
                        headerShown: false,
                        unmountOnBlur: true,
                        tabBarLabel: '',
                        tabBarButton: (_props) => (
                            <TouchableOpacity
                                {..._props}
                                activeOpacity={1}
                                onPress={() => {
                                    if (!isLogged) {
                                        return onOpenModal();
                                    }
                                    onOpen(true);
                                }}
                            />
                        ),
                        tabBarIcon: () => {
                            return (
                                <Box {...styles.containerCreateButton}>
                                    <Box {...styles.createButton} bg={colors.buttonPrimary.bgColor}>
                                        <MaterialCommunityIcons
                                            name="plus"
                                            size={30}
                                            color="white"
                                        />
                                    </Box>
                                    {/* <Box {...styles.createButtonBorderWrapper}>
                                        <Box {...styles.border} />
                                    </Box> */}
                                </Box>
                            );
                        },
                    }}
                />
                <Tab.Screen
                    name="Plot"
                    component={Plots}
                    options={{
                        headerShown: false,
                        tabBarLabel: (props) => {
                            return <TabLabel {...props}>{t('bottomTab.plot')}</TabLabel>;
                        },
                        tabBarIcon: ({ color, focused }) => {
                            return (
                                <Bookmark2
                                    color={focused ? colorFocus : color}
                                    variant={focused ? 'Bold' : 'Outline'}
                                />
                            );
                        },
                    }}
                    listeners={{
                        tabPress: (e) => {
                            if (!isLogged) {
                                e.preventDefault();
                                return onOpenModal();
                            }
                        },
                    }}
                />
                <Tab.Screen
                    name="Alerts"
                    component={Noti}
                    options={{
                        headerShown: false,
                        tabBarLabel: (props) => {
                            return <TabLabel {...props}>{t('bottomTab.alerts')}</TabLabel>;
                        },
                        tabBarIcon: ({ color, focused }) => {
                            return (
                                <NotificationsButton
                                    focused={focused}
                                    colorFocus={colorFocus}
                                    color={color}
                                />
                            );
                        },
                    }}
                    listeners={{
                        tabPress: (e) => {
                            if (!isLogged) {
                                e.preventDefault();
                                return onOpenModal();
                            }
                        },
                    }}
                />
            </Tab.Navigator>
            <QuickActions isOpen={isOpen} onClose={onClose} />
            <ModalRequiredLogin isOpen={state.isOpen} onClose={onCloseModal} />
            <ModalLimitCreatePlot
                isOpen={state.isOpenLimitCreatePlot}
                onClose={onCloseModalLimitCreatePlot}
            />
            <ModalFoundOfflinePlot isOpen={true} />
        </ModalContext.Provider>
    );
}
