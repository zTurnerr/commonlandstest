/* eslint-disable react-native/no-inline-styles */
import { Avatar, Box, HStack, ScrollView, Text, VStack } from 'native-base';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import useTranslate from '../../i18n/useTranslate';
import ModalCloseButton from '../Button/ModalCloseButton';
import AttestedTag from '../Tag/AttestedTag';
import AttestCircle from '../Icons/AttestCircle';
import moment from 'moment';
import { SCREEN_HEIGHT } from '../../util/Constants';

export const useModalAttestInfo = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSigner, setSelectedSigner] = useState({});

    const open = () => {
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    const Component = ({ plotData = {} }) => {
        return <ModalAttestInfo isOpen={isOpen} onClose={close} plotData={plotData} />;
    };

    return {
        Component,
        open,
        close,
        selectedSigner,
        setSelectedSigner,
    };
};

// const mockTestClaimant = () => {
//     // 3 owner, 2 renter, 1 rightOfUse
//     let claimants = [];
//     [...Array(1)].forEach(() => {
//         claimants.push({
//             role: 'owner',
//         });
//     });
//     [...Array(2)].forEach(() => {
//         claimants.push({
//             role: 'renter',
//         });
//     });
//     [...Array(1)].forEach(() => {
//         claimants.push({
//             role: 'rightOfUse',
//         });
//     });
//     return claimants;
// };

export default function ModalAttestInfo({ isOpen, onClose, plotData }) {
    const t = useTranslate();
    const plotName = plotData?.plot?.name;
    const Bullet = <Text fontSize={'13px'}>{'  \u2022  '}</Text>;
    const getPlotClaimantText = () => {
        let claimants = plotData?.plot?.claimantsMap || plotData?.plot?.claimants;
        let owner = claimants?.filter(
            (item) => item?.role === 'owner' || item?.role === 'co-owner',
        );
        let renter = claimants?.filter((item) => item?.role === 'renter');
        let rightOfUse = claimants?.filter((item) => item?.role === 'rightOfUse');
        let text = [];
        if (owner?.length > 0) {
            text.push(
                owner?.length +
                    ' ' +
                    (owner?.length === 1 ? t('components.owner') : t('components.owners')),
            );
        }
        if (renter?.length > 0) {
            text.push(
                renter?.length +
                    ' ' +
                    (renter?.length === 1 ? t('components.renter') : t('components.renters')),
            );
        }
        if (rightOfUse?.length > 0) {
            text.push(
                rightOfUse?.length +
                    ' ' +
                    (rightOfUse?.length === 1
                        ? t('claimants.rightOfUse')
                        : t('claimants.rightsOfUse')),
            );
        }
        return text.join(', ');
    };

    const getAttestedByTitle = () => {
        let regionManager = plotData?.plot?.attestedBy?.regionManagers?.find(
            (item) => item?.locationConfig === plotData?.plot?.location?._id,
        );
        return plotData?.plot?.attestationStamp?.attestorInfo?.title || regionManager?.title;
    };

    return (
        <Modal isVisible={isOpen} safeAreaTop={true}>
            <Box
                bottom="10px"
                position={'absolute'}
                justifyContent="center"
                p="15px"
                borderRadius="8px"
                bgColor="white"
                py="20px"
                maxH={SCREEN_HEIGHT * 0.95}
            >
                <ModalCloseButton onClose={onClose} />
                <HStack mb="20px">
                    <AttestedTag plotData={plotData} noModal />
                </HStack>
                <ScrollView>
                    <Text lineHeight={'22px'} fontSize={'12px'} fontWeight={500}>
                        {t('attestInfo.information', { plotName })}
                    </Text>
                    <Text lineHeight={'22px'} fontSize={'12px'} fontWeight={400}>
                        {t('attestInfo.desc1', { plotName })}
                    </Text>
                    <Text lineHeight={'22px'} fontSize={'12px'} fontWeight={500}>
                        {t('attestInfo.plotIdentification', { plotName })}
                    </Text>
                    <Text lineHeight={'22px'}>
                        {Bullet}
                        {t('attestInfo.plotId') + ': '}
                        <Text fontWeight={500}>{plotData?.plot?._id} </Text>
                    </Text>
                    <Text lineHeight={'22px'}>
                        {Bullet}
                        {t('components.createdAt') + ': '}
                        <Text fontWeight={500}>
                            {moment(plotData?.plot?.createdAt).format('MMM DD, YYYY')}{' '}
                        </Text>
                    </Text>

                    <Text lineHeight={'22px'} fontSize={'12px'} fontWeight={500}>
                        {t('attestInfo.infoAttested')}
                    </Text>
                    <Text lineHeight={'22px'}>
                        {Bullet}
                        {t('explore.location') + ': '}
                        <Text fontWeight={500}>{plotData?.plot?.placeName} </Text>
                    </Text>
                    <Text lineHeight={'22px'}>
                        {Bullet}
                        {t('components.size') + ': '}
                        <Text fontWeight={500}>{plotData?.plot?.area + 'm²'} </Text>
                    </Text>
                    <Text lineHeight={'22px'}>
                        {Bullet}
                        {t('invite.claimants') + ': '}
                        <Text fontWeight={500}>{getPlotClaimantText()} </Text>
                    </Text>
                    <Text lineHeight={'22px'} fontSize={'12px'} fontWeight={500} mt="40px">
                        {t('attestInfo.attestationIssuedBy')}
                    </Text>
                    <HStack alignItems="center" mt="10px" space={3}>
                        <Avatar
                            size={'72px'}
                            source={{ uri: plotData?.plot?.attestedBy?.avatar }}
                        />
                        <VStack flex={1} justifyContent={'center'}>
                            <Text lineHeight={'22px'} fontSize={'12px'} fontWeight={700}>
                                {plotData?.plot?.attestationStamp?.attestorInfo?.name ||
                                    plotData?.plot?.attestedBy?.fullName}
                            </Text>
                            <Text w="full" lineHeight={'22px'} fontSize={'12px'} fontWeight={500}>
                                {getAttestedByTitle()}
                            </Text>
                        </VStack>
                    </HStack>

                    <Text mt="50px" lineHeight={'22px'} fontSize={'12px'} fontWeight={500}>
                        {t('attestInfo.dateOfIssuance')}
                    </Text>
                    <Text lineHeight={'22px'} mb="30px">
                        <Text fontWeight={400}>
                            {moment(plotData?.plot?.attestationStamp?.updatedAt).format(
                                'MMM DD, YYYY',
                            )}{' '}
                        </Text>
                    </Text>
                    <Box position={'absolute'} bottom={'50px'} right={'30px'}>
                        <AttestCircle />
                    </Box>
                    <Text
                        mt="20px"
                        fontSize={'10px'}
                        color="rgba(0, 0, 0, 0.5)"
                        textAlign={'center'}
                    >
                        {t('plot.allRightsReserved')}
                    </Text>
                </ScrollView>
            </Box>
        </Modal>
    );
}
