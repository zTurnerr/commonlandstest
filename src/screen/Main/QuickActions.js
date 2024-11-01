import { Actionsheet, Box, Flex, Text } from 'native-base';
import { AgentAssistIcon, CreateContract, CreatePlot, QRScan } from '../../components/Icons';
import useTranslate from '../../i18n/useTranslate';
import { useNavigation } from '@react-navigation/core';
import { useTheme } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';

function Button({ icon: Icon, text, onPress, style = {}, disabled, hidden = false }) {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        wrapper: {
            width: '33%',
            backfaceVisibility: 'hidden',
            marginTop: !hidden ? 20 : 0,
        },
    });

    return (
        <TouchableOpacity onPress={onPress} disabled={disabled || hidden} style={styles.wrapper}>
            {!hidden && (
                <Box alignItems="center" {...style}>
                    <Box
                        bg={colors.primary[100]}
                        w="56px"
                        h="56px"
                        borderRadius="14px"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Icon />
                    </Box>
                    <Text bold mt="8px">
                        {text}
                    </Text>
                </Box>
            )}
        </TouchableOpacity>
    );
}

export default function Index({ isOpen, onClose }) {
    const t = useTranslate();

    const { mapReducer, user } = useShallowEqualSelector((state) => ({
        mapReducer: state.map,
        numberOfPlot: state.user.plots?.length + (state.user.userInfo.blockedPlots?.length || 0),
        user: state.user,
    }));

    const navigation = useNavigation();
    const { colors } = useTheme();
    const primary = colors.primary[600];
    // const modalContext = useContext(ModalContext);
    const Buttons = [
        {
            icon: (props) => <CreatePlot {...props} color={primary} />,
            onPress: () => {
                // if (numberOfPlot >= mapReducer.limitPlot) {
                //     return modalContext.onOpenModalLimitCreatePlot();
                // }
                navigation.navigate('CreatePlot', {
                    longlat: [mapReducer.currentPosition.long, mapReducer.currentPosition.lat],
                    zoom: mapReducer.currentPosition.zoom,
                });
                onClose();
            },
            text: t('others.createPlot'),
        },
        {
            icon: (props) => <CreateContract {...props} color={primary} />,
            onPress: () => {
                navigation.navigate('CreateContract');
                onClose();
            },
            text: t('others.createContract'),
            // disabled: !user?.userInfo?.isAgent,
        },
        {
            icon: (props) => <QRScan {...props} color={primary} />,
            onPress: () => {
                navigation.navigate('ScanQr');
                onClose();
            },
            text: t('others.verifyCertificate'),
            disabled: false,
        },
        {
            icon: (props) => <AgentAssistIcon {...props} color={primary} />,
            onPress: () => {
                navigation.navigate('AgentAssistLogin');
                onClose();
            },
            text: t('agentAssist.agentAssist'),
            hidden:
                !user?.userInfo?.isTrainer ||
                (user?.trainer?._id && user?.trainer?._id !== user?.userInfo?._id),
        },
        // {
        //     icon: () => <Image alt="icEditUser" source={Images.icEditUser} />,
        //     onPress: () => {
        //         navigation.navigate('JoinContract');
        //         onClose();
        //     },
        //     text: t('contract.joinContract'),
        // },
    ];

    const getGroupOf3 = (arr) => {
        const result = [];
        for (let i = 0; i < arr.length; i += 3) {
            result.push(
                arr
                    .filter((item) => {
                        return !item.hidden;
                    })
                    .slice(i, i + 3),
            );
        }
        if (result[result.length - 1].length === 0) {
            result.pop();
        }
        return result;
    };

    return (
        <>
            <Actionsheet isOpen={isOpen} onClose={onClose}>
                <Actionsheet.Content>
                    <Box w="full">
                        <Text bold px="12px" mb="22px">
                            {t('others.quickActions')}
                        </Text>
                        {/* <Flex
                            direction="row"
                            flexWrap="wrap"
                            justifyContent="space-around"
                            borderBottomColor="#E9ECED"
                            borderBottomWidth="1px"
                            px="0px"
                            pb="20px"
                        >
                            {Buttons.map((item, index) => (
                                <Button {...item} key={index} onClose={onClose} />
                            ))}
                        </Flex> */}
                        {getGroupOf3(Buttons).map((group, index) => (
                            <Flex
                                key={index}
                                direction="row"
                                flexWrap="wrap"
                                // justifyContent="space-around"
                                borderBottomColor="#E9ECED"
                                borderBottomWidth="1px"
                                px="0px"
                                pb="20px"
                            >
                                {group.map((item, index) => (
                                    <Button {...item} key={index} onClose={onClose} />
                                ))}
                            </Flex>
                        ))}
                        <Box alignItems="center" p="12px">
                            <TouchableOpacity
                                onPress={() => {
                                    onClose();
                                }}
                            >
                                <Box alignItems="center" w="56px">
                                    <Box
                                        bg={colors.primary[200]}
                                        w="56px"
                                        h="56px"
                                        borderRadius="28px"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <MaterialCommunityIcons
                                            name={'close'}
                                            size={30}
                                            color={colors.primary[900]}
                                        />
                                    </Box>
                                </Box>
                            </TouchableOpacity>
                        </Box>
                    </Box>
                </Actionsheet.Content>
            </Actionsheet>
        </>
    );
}
