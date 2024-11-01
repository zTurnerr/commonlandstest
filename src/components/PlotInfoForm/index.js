/* eslint-disable react-native/no-inline-styles */
import moment from 'moment';
import { Box, HStack, ScrollView, Text, useDisclose, useTheme } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import PlotStatus, { FlaggedStatus } from '../../components/PlotStatus';
import useTranslate from '../../i18n/useTranslate';
import { Certificate, CreatePlot, Location, Open, Radar } from '../Icons';
import PlotStatusSheet from './PlotStatusSheet';
import ClaimrankTag from '../Tag/ClaimrankTag';
import { useRoute } from '@react-navigation/native';
import Share from 'react-native-share';
import { getUrlShare } from '../../util/Constants';
import { PlotDataObject } from '../../object/plotDataObject';
import useWorthwhileNumber from '../../hooks/useWorthwhileNumber';
import AttestedTag from '../Tag/AttestedTag';
import ButtonAttestPlot from '../Button/ButtonAttestPlot';
import { canAttestPlot } from '../../util/plot/attestation';
import useUserInfo from '../../hooks/useUserInfo';
import { openClaimrankSheet } from '../../redux/reducer/modal/claimrankSheetSlice';

export default function Index({
    plotData,
    onPress,
    showStatus,
    showPlotID,
    showOwner,
    onInvitePress,
    numberClaimchain,
    hideShare = false,
    permissions = {},
    hideTitle,
    showStatusScale,
    isFlagged = false,
    disabledPressPlotStatus = false,
    showClaimrank = true,
    scrollTag = true,
}) {
    const { colors } = useTheme();
    const { isOpen, onOpen, onClose } = useDisclose();
    const { name: routeName } = useRoute();
    const { plot, userInfo } = plotData || {};
    const user = useUserInfo();
    const { name, createdAt, placeName, area } = plot || {};
    const worthwhileNumberHook = useWorthwhileNumber();
    const worthwhileNumber =
        new PlotDataObject(plotData).regionConfigNoGeometry?.claimchainSize || worthwhileNumberHook;
    const isOwner = () => {
        return permissions?.editPlotBoundaries;
    };

    const getStatus = () => {
        if (plotData?.plot?.status || plotData?.plot?.status === 0) {
            if (plotData?.plot?.isOnHold) {
                return 7;
            }
            return plotData?.plot?.status;
        }
        return 1;
    };

    const share = async () => {
        try {
            let uri = getUrlShare({
                id: plotData?.plot?._id,
                longlat: plotData?.plot?.centroid,
            });
            await Share.open({
                title: t('subplot.titleShare'),
                message: `${t('subplot.secureMyLand')}: `,
                url: uri,
            });
        } catch (err) {}
    };

    const t = useTranslate();

    let ClaimchainTag =
        numberClaimchain >= worthwhileNumber || plot?.isOnHold ? (
            <Box
                {...styles.row}
                mr="12px"
                // ml={showStatusScale ? '6px' : '12px'}
                bg="rgba(94, 196, 172, 0.15)"
                h="34px"
                px="8px"
                borderRadius="30px"
            >
                <Certificate
                    width={showStatusScale ? '16' : '20'}
                    height={showStatusScale ? '16' : '20'}
                    color="rgba(38, 115, 133, 1)"
                />
                <Text
                    ml="5px"
                    fontSize={showStatusScale ? '10px' : '12px'}
                    color="rgba(38, 115, 133, 1)"
                >
                    {t('components.certificateDrafted')}
                </Text>
            </Box>
        ) : (
            <Box
                {...styles.row}
                mr="12px"
                // ml={showStatusScale ? '6px' : '12px'}
                bg="gray.200"
                h="34px"
                px="8px"
                borderRadius="30px"
            >
                <Radar
                    style={styles.radar}
                    width={showStatusScale ? 16 : 20}
                    height={showStatusScale ? 16 : 20}
                />
                <Text ml="5px" fontWeight="500" fontSize={showStatusScale ? '10px' : '12px'}>
                    {t('components.claimchain')} {numberClaimchain} {t('components.of')}{' '}
                    {worthwhileNumber}
                </Text>
            </Box>
        );

    if (routeName === 'CreatePlot') {
        ClaimchainTag = null;
    }

    return (
        <>
            {onPress ? (
                <HStack flexDir="row" justifyContent={'flex-start'} alignItems="center" mb="8px">
                    <TouchableOpacity onPress={onPress}>
                        <Text fontSize="16px" fontWeight="700" mr="10px">
                            {t('bottomTab.plot')} {plot?.plot?.name || name || 'info'}
                        </Text>
                    </TouchableOpacity>
                    <AttestedTag plotData={plotData} />
                </HStack>
            ) : (
                <HStack width={'full'} alignItems="center" mb="4px">
                    <Text mr="10px" fontSize="16px" fontWeight="700">
                        {t('bottomTab.plot')} {plot?.plot?.name || name || 'info'}
                    </Text>
                    <HStack justifyContent={'flex-start'}>
                        <AttestedTag plotData={plotData} />
                        {canAttestPlot(user, plotData) && <ButtonAttestPlot plotData={plotData} />}
                    </HStack>

                    {permissions?.editPlotBoundaries && (
                        <Box flexDir="row" alignItems="center" justifyContent={'flex-end'} flex={1}>
                            {!hideShare && (
                                <TouchableOpacity onPress={share}>
                                    <Box flexDirection="row" alignItems="center">
                                        <Open width={20} h={20} color={colors.primary[500]} />
                                        <Text color="primary.500" ml="4px">
                                            {t('button.share')}
                                        </Text>
                                    </Box>
                                </TouchableOpacity>
                            )}
                        </Box>
                    )}
                </HStack>
            )}

            {showPlotID && (
                <Text fontSize="10px" mb="4px">
                    {plotData.plot.id ? plotData.plot.id + ' - ' : ''} {t('components.createdAt')}:{' '}
                    {moment(plot?.plot?.createdAt || createdAt).format('MMM DD, YYYY')}
                </Text>
            )}
            {showOwner && isOwner() && (
                <Text mb="4px" fontWeight="bold">
                    {t('components.creator')}: {userInfo?.phoneNumber}
                </Text>
            )}
            <Box {...styles.row} alignItems="center">
                <Location color={colors.primary[600]} />
                <Text flex={1} flexWrap="wrap" ml="8px" numberOfLines={2}>
                    {!hideTitle && `${t('explore.location')}: `}
                    <Text fontWeight="bold" numberOfLines={2}>
                        {plot?.plot?.placeName || placeName || ''}
                    </Text>
                </Text>
            </Box>
            <Box {...styles.row} alignItems="center">
                <CreatePlot width="16" color={colors.primary[600]} />
                <Text ml="8px">
                    {!hideTitle && `${t('components.size')}: `}
                    <Text fontWeight="bold">
                        {plot?.plot?.area || area || ''} m{`\u00B2`}
                    </Text>
                </Text>
            </Box>
            {Boolean(isFlagged) && <FlaggedStatus showStatusScale={showStatusScale} />}

            {showStatus && (
                <>
                    <Box {...styles.row} mb="4px">
                        <ScrollView w="full" horizontal>
                            {showClaimrank &&
                                (plotData?.plot?.claimStrength || plotData?.plot?.claimRank) && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            openClaimrankSheet(
                                                plotData?.plot?._id,
                                                plotData?.plot?.claimRank,
                                            );
                                        }}
                                    >
                                        <ClaimrankTag
                                            type={
                                                plotData?.plot?.claimStrength ||
                                                plotData?.plot?.claimRank
                                            }
                                        />
                                    </TouchableOpacity>
                                )}
                            <TouchableOpacity
                                onPress={!disabledPressPlotStatus ? onOpen : () => {}}
                                style={{
                                    marginRight: 10,
                                    marginBottom: 7,
                                }}
                            >
                                <PlotStatus
                                    _textStyle={showStatusScale ? styles.text : {}}
                                    _iconStyle={showStatusScale ? styles.icon : {}}
                                    status={getStatus()}
                                    h="34px"
                                    px="6px"
                                />
                            </TouchableOpacity>
                            {scrollTag && ClaimchainTag}
                        </ScrollView>
                    </Box>
                    {!scrollTag && <HStack>{ClaimchainTag}</HStack>}
                    <PlotStatusSheet
                        onInvitePress={onInvitePress}
                        isOpen={isOpen}
                        onClose={onClose}
                        status={getStatus()}
                        worthwhileNumber={worthwhileNumber}
                    />
                </>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        mb: '4px',
    },
    radar: {
        marginLeft: 4,
    },
    icon: {
        width: 16,
        height: 16,
    },
    text: {
        fontSize: '10px',
    },
});
