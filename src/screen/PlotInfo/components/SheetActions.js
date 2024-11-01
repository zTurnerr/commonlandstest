import { Actionsheet, Box, Text, useTheme } from 'native-base';
import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    CancelLeft,
    CreateSubplotIcon,
    Delete,
    EditPolygonIcon,
    GalleryEditIcon,
    ManagerClaimants,
    ManagerNeighbors,
    TransferOwnershipIcon,
} from '../../../components/Icons';
import CheckCircle from '../../../components/Icons/CheckCircle';
import useWorthwhileNumber from '../../../hooks/useWorthwhileNumber';
import useTranslate from '../../../i18n/useTranslate';
import { canAllowTransferOrWithdraw, checkExistTransferOrWithdraw } from '../../../util/utils';
import useShallowEqualSelector from '../../../redux/customHook/useShallowEqualSelector';
import { ExportCurve } from 'iconsax-react-native';
import { canAttestPlot } from '../../../util/plot/attestation';

export default function SheetActions({
    isOpen,
    onClose,
    permissions,
    onSelect,
    plotData,
    isFlagged,
}) {
    const t = useTranslate();
    const userInfo = useShallowEqualSelector((state) => state.user.userInfo);
    useWorthwhileNumber();
    const theme = useTheme();
    const isDefault = plotData?.plot?.status === 'defaulted';
    const isAllowEditPolygon = useMemo(() => {
        if (plotData?.isEditing || plotData?.isBeingGhostDispute) return false;
        if (plotData?.subPlots?.length > 0) {
            return false;
        }

        const claimants = plotData?.claimants || [];
        const numberOwner = claimants.filter(
            (item) => item?.role === 'owner' || item?.role === 'co-owner',
        ).length;
        const usr = claimants.find((item) => item._id === userInfo?._id);
        if (usr) {
            if (usr?.role === 'owner' || usr?.role === 'co-owner') {
                return true;
            }
            if (numberOwner >= 1) return false;
            return true;
        }
        return false;
    }, [plotData]);

    const Data = [
        {
            id: 0,
            title: t('plot.editPlotPolygon'),
            icon: <EditPolygonIcon color={theme.colors.primary[600]} />,
            isVisible: () => {
                return isAllowEditPolygon && !isFlagged && permissions?.editPlot;
            },
            key: 'editPlotPolygon',
            disabled: true,
        },
        {
            id: 6,
            title: t('plotInfo.editPhotosBoundary'),
            icon: <GalleryEditIcon color={theme.colors.primary[600]} />,
            isVisible: (permissions) => {
                return permissions?.editPlotBoundaries;
            },
            key: 'editPlot',
        },
        {
            id: 3,
            title: t('plot.manageClaimants'),
            icon: <ManagerClaimants color={theme.colors.primary[600]} />,
            isVisible: (permissions) => {
                return permissions?.inviteClaimant && !isDefault;
            },
            key: 'managerClaimants',
        },
        {
            id: 4,
            title: t('plot.manageNeighbors'),
            icon: <ManagerNeighbors color={theme.colors.primary[600]} />,
            isVisible: (permissions) => {
                return permissions?.inviteNeighbor;
            },
            key: 'managerNeighbors',
        },
        {
            id: 5,
            title: t('plotInfo.createSubPlot'),
            icon: <CreateSubplotIcon color={theme.colors.primary[600]} />,
            isVisible: (permissions) => {
                return permissions?.createSubPlotInvitation && !isFlagged && !isDefault;
            },
            key: 'createSubplot',
        },
        {
            id: 1,
            title: t('plot.transferOwnership'),
            icon: <TransferOwnershipIcon color={theme.colors.primary[600]} />,
            isVisible: (permissions) => {
                return (
                    permissions?.requestTransferOwnership &&
                    canAllowTransferOrWithdraw(plotData?.plot) &&
                    !checkExistTransferOrWithdraw(plotData) &&
                    !isFlagged &&
                    !isDefault
                );
            },
            key: 'transferOwnership',
            disabled: true,
        },
        {
            id: 2,
            title: t('plot.withdrawalFromPlot'),
            icon: <CancelLeft color={theme.colors.primary[600]} />,
            isVisible: () => {
                return (
                    !checkExistTransferOrWithdraw(plotData) &&
                    canAllowTransferOrWithdraw(plotData?.plot) &&
                    !isFlagged &&
                    !isDefault
                );
            },
            key: 'withdrawalFromPlot',
        },
        {
            id: 8,
            title: t('plotInfo.sharePlot'),
            icon: <ExportCurve color={theme.colors.primary[600]} />,
            isVisible: (permissions) => {
                return permissions?.editPlotBoundaries && !isFlagged;
            },
            key: 'sharePlot',
        },
        {
            id: 9,
            title: t('plot.attestThisPlot'),
            icon: <CheckCircle color={theme.colors.primary[600]} />,
            isVisible: () => {
                return canAttestPlot(userInfo, plotData);
            },
            key: 'attestPlot',
        },
        {
            id: 7,
            title: t('button.deletePlot'),
            icon: <Delete color={theme.colors.danger[700]} />,
            bgColor: 'danger.800',
            titleColor: 'danger.700',
            isVisible: (permissions) => {
                return (
                    permissions?.deletePlot && !isDefault && plotData?.plot.isEligibleForDeletion
                );
            },
            key: 'deletePlot',
        },
    ];

    return (
        <Actionsheet isOpen={isOpen} onClose={onClose} size="full">
            <Actionsheet.Content {...styles.content}>
                <Box {...styles.header}>
                    <Text fontSize="16px" fontWeight="700">
                        {t('plotInfo.settingsPlot')}
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                        <MaterialCommunityIcons name="close" size={20} color="black" />
                    </TouchableOpacity>
                </Box>
                {Data.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        disabled={!item.isVisible(permissions)}
                        onPress={() => {
                            onSelect(item.key);
                            onClose();
                        }}
                        style={
                            item.isVisible(permissions) ? styles.itemVisible : styles.itemUnVisible
                        }
                    >
                        <Box {...styles.item}>
                            <Box {...styles.icon} bgColor={item?.bgColor || 'primary.200'}>
                                {item.icon}
                            </Box>

                            <Text {...styles.text} color={item?.titleColor || 'black'}>
                                {item.title}
                            </Text>
                        </Box>
                    </TouchableOpacity>
                ))}
            </Actionsheet.Content>
        </Actionsheet>
    );
}

const styles = StyleSheet.create({
    itemUnVisible: {
        opacity: 0.3,
    },
    itemVisible: {
        opacity: 1,
    },
    content: {
        alignItems: 'flex-start',
        w: 'full',
        paddingBottom: '30px',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        mt: '12px',
        w: '100%',
        px: '12px',
    },

    icon: {
        w: '40px',
        h: '40px',
        borderRadius: '20px',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: '14px',
        fontWeight: '500',
        ml: '10px',
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        w: '100%',
        // pb: '12px',
        px: '12px',
    },
});
