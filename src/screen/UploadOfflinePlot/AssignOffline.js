import { useNavigation } from '@react-navigation/native';
import { Box, ChevronDownIcon, ScrollView, Text, useDisclose, useTheme } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import DeleteIconButton from '../../components/Button/DeleteIconButton';
import { CheckExistTrainer } from '../../components/Header/utils/trainer';
import { InviteAssign } from '../../components/Icons';
import RoleAssign from '../../components/RoleAssign';
import useTranslate from '../../i18n/useTranslate';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { Role } from '../CreatePlot/InvitePeople/UserRow';
import RowClaimantsSelected from './AssignClaimants/RowClaimantsSelected';
import SheetAssign from './AssignClaimants/SheetAssign';

const AssignOffline = ({ assign, setAssign, yourselfRole, setYourselfRole }) => {
    const t = useTranslate();
    const navigation = useNavigation();
    const { user } = useShallowEqualSelector((state) => ({
        user: state.user,
    }));
    const { colors } = useTheme();
    const {
        isOpen: isOpenAssignSheet,
        onClose: onCloseAssignSheet,
        onOpen: onOpenAssignSheet,
    } = useDisclose();

    if (!CheckExistTrainer(user?.trainer, user)) {
        return (
            <Box bgColor={'white'} flex={1} px={'20px'} pt={'30px'}>
                <RoleAssign role={yourselfRole} setRole={setYourselfRole} />
            </Box>
        );
    }

    const deleteUserFromSelected = (phoneNumber) => {
        let users = [...assign.users];
        const newClaimants = users.filter((item) => item?.phoneNumber !== phoneNumber);
        setAssign((old) => ({
            ...old,
            users: newClaimants,
        }));
    };

    return (
        <>
            <Box mt={'5px'} shadow={1}>
                <Box bgColor={'white'} px={'20px'} py={'15px'}>
                    <Text mb={'10px'} fontWeight={600} fontSize={14}>
                        {' '}
                        {t('components.assignThePeople')}
                    </Text>
                    <TouchableOpacity onPress={onOpenAssignSheet}>
                        <Box
                            borderWidth={1}
                            px={'15px'}
                            borderRadius={'8px'}
                            borderColor={'gray.2300'}
                            py={'12px'}
                            flexDir={'row'}
                        >
                            <Text flex={1}>
                                {!assign.self
                                    ? t('offlineMaps.lookupAssignPeople')
                                    : t('offlineMaps.assignYourself')}
                            </Text>
                            <ChevronDownIcon />
                        </Box>
                    </TouchableOpacity>
                </Box>
            </Box>

            {assign.self ? (
                <Box bgColor={'white'} px={'20px'} pt={'30px'} pb={'20px'} mt={'6px'}>
                    <RoleAssign role={yourselfRole} setRole={setYourselfRole} />
                </Box>
            ) : (
                <>
                    <Box flexDir={'row'} px={'20px'} pt={'20px'} alignItems={'center'}>
                        <Text flex={1} fontSize={14} fontWeight={500}>
                            {t('invite.claimants')}
                        </Text>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('uploadOfflinePlotAssign', {
                                    assign: assign,
                                    setAssign,
                                })
                            }
                        >
                            <Box
                                flexDir={'row'}
                                alignItems={'center'}
                                borderWidth={1}
                                borderColor={'primary.600'}
                                borderRadius={'8px'}
                                p={'8px'}
                            >
                                <InviteAssign color={colors.primary[600]} />
                                <Text
                                    ml={'8px'}
                                    color={'primary.600'}
                                    fontWeight={600}
                                    fontSize={12}
                                >
                                    {t('button.assign')}
                                </Text>
                            </Box>
                        </TouchableOpacity>
                    </Box>
                    <ScrollView mt={'10px'}>
                        {assign?.users.length > 0 &&
                            assign?.users?.map((item, index) => (
                                <RowClaimantsSelected
                                    info={item}
                                    button={
                                        <DeleteIconButton
                                            onPress={() => deleteUserFromSelected(item.phoneNumber)}
                                        />
                                    }
                                    type={null}
                                    key={index}
                                >
                                    <Box mt={'6px'}>
                                        <Role type={item?.roleSelected} info={item} />
                                    </Box>
                                </RowClaimantsSelected>
                            ))}
                        {assign?.users.length === 0 && (
                            <Box mt={'50px'} justifyContent={'center'} alignItems={'center'}>
                                <Text fontWeight={600} fontSize={12}>
                                    {t('error.noClaimants')}
                                </Text>
                                <Text color={'gray.1300'} fontSize={12}>
                                    {t('offlineMaps.pleaseInviteAssign')}
                                </Text>
                            </Box>
                        )}
                    </ScrollView>
                </>
            )}

            <SheetAssign
                isOpen={isOpenAssignSheet}
                onClose={onCloseAssignSheet}
                setAssign={setAssign}
            />
        </>
    );
};

export default AssignOffline;
