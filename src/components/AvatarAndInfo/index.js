import moment from 'moment';
import { Box, Button, FlatList, HStack, Icon, Image, Skeleton, Text, VStack } from 'native-base';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useTranslate from '../../i18n/useTranslate';
import IconChip from '../IconChip';
import { useRoute } from '@react-navigation/native';

/**
 * @typedef {{
 * avatar: string
 * primary: string
 * secondary: string
 * secondaryStyles: import('native-base').ITextProps
 * pending: boolean
 * canCancel: boolean
 * willExpiredAfter: string | Date
 * onCancelInvite: () => void
 * endAdornment: React.ReactNode
 * isLoading?: boolean
 * }} AvatarAndInfoProps
 * @param {AvatarAndInfoProps} props
 */
export default function AvatarAndInfo({
    avatar,
    secondary,
    primary,
    actions = [],
    secondaryStyles = {},
    primaryStyles = {},
    children,
    pending = false,
    canCancel = false,
    willExpireAfter,
    onCancelInvite,
    endAdornment,
    isLoading = false,
    ...style
}) {
    const t = useTranslate();
    const expireTime = moment(Date.now() + willExpireAfter).fromNow(true);
    const route = useRoute();
    return (
        <Box {...styles.container} {...style} alignItems="flex-start">
            {isLoading ? (
                <Skeleton w="10" h="10" borderRadius="full" />
            ) : avatar ? (
                <Image source={{ uri: avatar }} alt="avatar" {...styles.img} />
            ) : (
                <Icon size={10} as={<MaterialCommunityIcons name="account-circle" />} />
            )}
            <VStack ml="10px" flex={1} space="12px">
                <Box alignItems="flex-start" flexDirection="row">
                    <Box alignItems="flex-start" flex="1">
                        {isLoading ? (
                            <Skeleton h="4" />
                        ) : (
                            !!primary && (
                                <Text {...styles.primary} {...primaryStyles}>
                                    {primary}
                                </Text>
                            )
                        )}
                        {isLoading ? (
                            <Skeleton h="3" mt="1" />
                        ) : (
                            !!secondary && (
                                <Text {...styles.secondary} {...secondaryStyles}>
                                    {secondary}
                                </Text>
                            )
                        )}
                        {children}
                    </Box>
                    <HStack space="12px" alignItems="center">
                        {!isLoading && endAdornment}
                    </HStack>
                </Box>
                {!isLoading && pending && (
                    <VStack space="12px">
                        <FlatList
                            space="5px"
                            data={[
                                {
                                    text: t('invite.pendingApproval'),
                                    icon: (
                                        <MaterialCommunityIcons
                                            name="clock-check-outline"
                                            size={16}
                                        />
                                    ),
                                },
                                {
                                    text: t('invite.expireIn', { time: expireTime }),
                                    icon: <MaterialCommunityIcons name="history" size={16} />,
                                },
                            ]}
                            renderItem={({ item }) => (
                                <IconChip
                                    icon={item.icon}
                                    text={item.text}
                                    colorScheme="warning"
                                    mr="5px"
                                />
                            )}
                            horizontal
                            w="full"
                        />
                        {(canCancel || actions) && !route?.params?.creatingSubPlot && (
                            <HStack alignItems="center" space="12px">
                                {canCancel && (
                                    <Button
                                        colorScheme="blue"
                                        variant="outline"
                                        size="sm"
                                        borderColor="blue.600"
                                        onPress={onCancelInvite}
                                    >
                                        {t('invite.cancelInvite')}
                                    </Button>
                                )}
                                {actions}
                            </HStack>
                        )}
                    </VStack>
                )}
            </VStack>
        </Box>
    );
}

const styles = {
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        py: '21px',
        bgcolor: 'red.200',
    },
    img: {
        w: '42px',
        h: '42px',
        borderRadius: '21px',
    },
    info: {
        ml: '10px',
        flex: 1,
    },
    primary: {
        fontSize: '14px',
        fontWeight: 'bold',
    },
    secondary: {
        fontSize: '11px',
        color: 'rgba(0, 0, 0, 0.65)',
        fontWeight: '400',
    },
};
