import { Box, ScrollView, Skeleton, Text } from 'native-base';
import useTranslate from '../../i18n/useTranslate';

import React from 'react';
import { StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Map from '../../components/Map';
import { usePlotInfo } from '../../hooks/usePlotinfo';
import { INVITE_STATUS } from '../../util/Constants';
import ReviewPlot from '../CreatePlot/ReviewPlot';
import EditPlot from './EditPlot';
import InvitePeopleStep from './InvitePeopleStep';
import ModalConfirmInvite from './ModalConfirmInvite';
import ModalConfirmInviteClaimant from './ModalConfirmInviteClaimant';
import ModalInvite from './ModalInvite';
import ViewPhotos from './ViewPhotos';
import ButtonEdit from './components/ButtonEditPlot';
import ButtonGoToInviteStep from './components/ButtonGoToInviteNeightbor';
import ButtonInviteClamant from './components/ButtonInviteClaimant';
import GroupButtonEditStep from './components/GroupButtonEditStep';
import InvitePeopleSheet from './components/InvitePeopleSheet';
import Uploading from './components/Uploading';
import ModalConfirmDelete from './ModalConfirmDeletePlot';

const INVITE_TAB = [1, 4, 5];
const PlotFlaggedInfo = ({ route, plotData }) => {
    let { longlat, plotFlagged } = route?.params || {};
    let _plotData = plotFlagged || plotData || {};
    const { plot, neighbors, claimants, permissions } = _plotData;
    const {
        download,
        sendMessage,
        onEvent,
        onInviteClaimantFlagged,
        getStyle,
        setInvitePeople,
        _acceptNeightbor,
        onReject,
        rejectClaimantOrNeightBor,
        acceptClaimantOrNeightBor,
        cancelUploadFile,
        onImagePress,
        getViewPhotosData,
        getStatus,
        onPlotPress,
        hideMarker,
        getInvites,
        requesting,
        _uploadBoundary,
        step,
        onChangeStep,
        isOpenAccept,
        onOpenAccept,
        onCloseAccept,
        isOpenAcceptClaimant,
        onCloseAcceptClaimant,
        navigation,
        selectedInvite,
        webviewRef,
        selectedIndex,
        onSetSelectedIndex,
        progressValue,
        TITLE,
        plotsN,
        plotsInvites,
        images,
        files,
        isLoading,
        error,
        updateError,
        onSetIDMarkerActive,
        iDMarkerActive,
        isOpen,
        onOpen,
        onClose,
        newFiles,
        onSetNewFiles,
        deleteFilesList,
        onSetDeleteFilesList,
        // colors,
        points,
        tab,
        onChangeTab,
        onSelectAction,
        isOpenInviteSheet,
        onOpenInviteSheet,
        onCloseInviteSheet,
        onInvites,
        onDeleteInvite,
        onDeleteClaimant,
        isOpenDelete,
        onCloseDelete,
        onDeletePlot,
    } = usePlotInfo({ plotFlagged: _plotData, isFlagged: true });
    const getTitle = () => {
        if (step === 1 && tab === 1) {
            return TITLE[4];
        }
        if (step === 1 && tab === 2) {
            return TITLE[5];
        }
        return TITLE[step];
    };
    const t = useTranslate();
    return (
        <>
            <Box bg="white" h="full">
                <Header
                    icon={<MaterialCommunityIcons name="close" size={20} color="black" />}
                    onBack={() => {
                        if (step !== 0) {
                            if (step === 1) {
                                hideMarker();
                            }
                            return onChangeStep(0);
                        }
                        if (navigation.canGoBack()) {
                            navigation.goBack();
                        } else {
                            navigation.navigate('Main');
                        }
                    }}
                    title={getTitle()}
                >
                    {!isLoading && step === 0 && (
                        <ButtonEdit
                            permissions={{ ..._plotData?.permissions, inviteNeighbor: false }}
                            onSelect={onSelectAction}
                            plotData={_plotData}
                            isFlagged={true}
                        />
                    )}
                </Header>

                <ScrollView
                    overScrollMode="never"
                    w="full"
                    contentContainerStyle={styles.scrollView}
                >
                    {!plot || error ? (
                        <Text textAlign="center" fontSize="14px" color="error.400" mt="30px">
                            {error ? error : t('others.notFoundPlot')}
                        </Text>
                    ) : (
                        <>
                            <Box style={getStyle()}>
                                {isLoading && (
                                    <Box position="absolute" zIndex="2" w="full" h="full">
                                        <Skeleton height="100%" />
                                    </Box>
                                )}
                                <Map
                                    useGlobalData={false}
                                    onEvent={onEvent}
                                    mapRef={webviewRef}
                                    search={`${longlat ? `longlat=${longlat}&` : ''}zoom=10`}
                                />
                            </Box>
                            {step === 0 && (
                                <ReviewPlot
                                    plotData={plot}
                                    tab={tab}
                                    permissions={permissions}
                                    claimants={claimants}
                                    disputedPlot={[]}
                                    setInvitePeople={setInvitePeople}
                                    images={images}
                                    neightbors={neighbors}
                                    numberClaimchain={1}
                                    onDownloadPress={download}
                                    status={getStatus()}
                                    invitesPending={plotsInvites?.created
                                        ?.filter((i) => i.status === INVITE_STATUS.sent)
                                        ?.map((i) => ({
                                            ...i,
                                            phoneNumber: i.inviteePhoneNumber,
                                        }))}
                                    onImagePress={onImagePress}
                                    isLoading={isLoading}
                                    onPlotPress={onPlotPress}
                                    isFlagged={true}
                                    plot={plot}
                                    onChangeTab={(index) => {
                                        onChangeTab(index);
                                    }}
                                    onDeleteInvite={onDeleteInvite}
                                    onDeleteClaimant={onDeleteClaimant}
                                />
                            )}
                            {INVITE_TAB.includes(step) && (
                                <InvitePeopleStep
                                    renderPlot={() => {}}
                                    sendMessage={sendMessage}
                                    plotsN={plotsN}
                                    onOpenAccept={onOpenAccept}
                                    setIDMarkerActive={onSetIDMarkerActive}
                                    iDMarkerActive={iDMarkerActive}
                                    setSelectedIndex={onSetSelectedIndex}
                                    onOpen={onOpen}
                                    plotData={_plotData}
                                    plotsInvites={plotsInvites}
                                    onInvited={getInvites}
                                    isFlagged={true}
                                    tab={step === 1 ? tab : step === 4 ? 1 : 2}
                                    onDeleteInvite={onDeleteInvite}
                                    onDeleteClaimant={onDeleteClaimant}
                                />
                            )}
                            {step === 2 && (
                                <EditPlot
                                    sendMessage={sendMessage}
                                    plotData={_plotData}
                                    oldFiles={files}
                                    files={newFiles}
                                    setFiles={onSetNewFiles}
                                    setDeleteFilesList={onSetDeleteFilesList}
                                    deleteFilesList={deleteFilesList}
                                    points={points}
                                />
                            )}
                            {step === 3 && (
                                <ViewPhotos
                                    sendMessage={sendMessage}
                                    plotData={_plotData}
                                    files={files}
                                    points={points}
                                    {...getViewPhotosData()}
                                />
                            )}
                        </>
                    )}
                </ScrollView>
                {/* show when edit mode */}
                <GroupButtonEditStep
                    step={step}
                    updateError={updateError}
                    cancelUploadFile={cancelUploadFile}
                    uploadBoundary={_uploadBoundary}
                    requesting={requesting}
                />
                {/* show when review plot */}
                <ButtonGoToInviteStep
                    isLoading={isLoading}
                    step={step}
                    tab={tab}
                    plotData={_plotData}
                    onClick={() => {
                        onChangeStep(1);
                    }}
                />
                {/* show when invite clamant  step === 1,4,5*/}
                <ButtonInviteClamant
                    step={step}
                    tab={tab}
                    plotData={_plotData}
                    onOpenInviteSheet={onOpenInviteSheet}
                />
            </Box>
            <Uploading requesting={requesting} progressValue={progressValue} />
            <ModalInvite isOpen={isOpen} onClose={onClose} onSubmit={onInviteClaimantFlagged} />
            <ModalConfirmInvite
                isOpen={isOpenAccept}
                onClose={onCloseAccept}
                onSubmit={_acceptNeightbor}
                onReject={onReject}
                invite={plotsN[selectedIndex]?.invite}
            />
            <ModalConfirmInviteClaimant
                isOpen={isOpenAcceptClaimant}
                onClose={onCloseAcceptClaimant}
                onSubmit={acceptClaimantOrNeightBor}
                onReject={rejectClaimantOrNeightBor}
                invite={selectedInvite}
            />
            <InvitePeopleSheet
                isOpen={isOpenInviteSheet}
                onClose={onCloseInviteSheet}
                onInvites={onInvites}
            />
            <ModalConfirmDelete
                isOpen={isOpenDelete}
                onClose={onCloseDelete}
                onSubmit={onDeletePlot}
                plotData={plotData}
            />
        </>
    );
};

export default PlotFlaggedInfo;

const styles = StyleSheet.create({
    scrollView: { paddingBottom: 60 },
});
