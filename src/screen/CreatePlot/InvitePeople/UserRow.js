import { getCertificateStatus } from 'cml-script';
import { Box, Icon, Image, Text } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PlotRole from '../../../components/PlotRole';
import { CertificateStatus } from '../../../components/PlotStatus';
import useShallowEqualSelector from '../../../redux/customHook/useShallowEqualSelector';

export const Role = ({
    type,
    onPress,
    info,
    button: ButtonC,
    containerProps = {},
    iconSize = '6',
}) => {
    return type ? (
        <PlotRole type={type} iconSize={iconSize} {...containerProps} />
    ) : Boolean(onPress) ? (
        <TouchableOpacity
            onPress={() => {
                onPress(info);
            }}
        >
            <Icon
                mr="12px"
                as={<MaterialCommunityIcons name="close-circle-outline" />}
                size={6}
                color="primary.600"
            />
        </TouchableOpacity>
    ) : ButtonC ? (
        ButtonC
    ) : null;
};
export default function Index({
    info,
    owner,
    onPress,
    button,
    type,
    pending,
    hideInfo,
    children,
    ...style
}) {
    const isLogged = useShallowEqualSelector((state) => state.user.isLogged);
    let _hideInfo = !isLogged || hideInfo;

    // const TYPE = {
    //     owner: 'Owner',
    //     renter: 'Renter',
    //     rightOfUse: t('claimants.rightOfUse'),
    //     'co-owner': 'Co-owner',
    //     creator: t('components.creator'),
    // };
    return (
        <Box flexDirection="row" alignItems="center" mb="22px" py="21px" {...style}>
            {info.avatar ? (
                <Image
                    source={{ uri: info.avatar }}
                    alt="avatar"
                    w="42px"
                    h="42px"
                    borderRadius="21px"
                />
            ) : (
                <Icon size={10} as={<MaterialCommunityIcons name="account-circle" />} />
            )}
            <Box ml="10px" flex={1}>
                {!_hideInfo ? (
                    <Box alignItems="flex-start">
                        <Text fontSize="14px" fontWeight="bold">
                            {info.fullName}
                        </Text>
                        <Text
                            fontSize="11px"
                            color={
                                pending
                                    ? 'rgba(255, 195, 41, 1)'
                                    : owner
                                      ? 'rgba(0, 0, 0, 0.65)'
                                      : 'primary.600'
                            }
                            fontWeight="400"
                        >
                            {info.phoneNumber}
                        </Text>
                        <CertificateStatus
                            status={getCertificateStatus(info.claimantStatus)}
                            mt="4px"
                        />
                        {children}
                    </Box>
                ) : (
                    <>
                        <Box bgColor="gray.300" w="80%" h="20px" borderRadius="4px" mb="4px"></Box>
                        <Box bgColor="gray.300" w="100px" h="20px" borderRadius="4px"></Box>
                    </>
                )}
            </Box>
            <Role info={info} type={type} onPress={onPress} button={button} />
        </Box>
    );
}
