import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert } from 'react-native';
import { Bell } from '../../../components/Icons';
import useShallowEqualSelector from '../../../redux/customHook/useShallowEqualSelector';
import { getPlotByID } from '../../../rest_client/apiClient';
import TYPES from '../NotificationConstants';
import IconWrapper from './IconWrapper';
import Info from './Info';
import Wrapper from './Wrapper';

export default function Index({ data, setLoading = () => {} }) {
    const user = useShallowEqualSelector((state) => state.user);
    const navigation = useNavigation();

    let plot = JSON.parse(data?.data || {});
    const onFetchPlot = async () => {
        try {
            const { data } = await getPlotByID(plot?.plot);
            return data?.plot || {};
        } catch (error) {
            Alert.alert('Error', error);
            return false;
        }
    };

    const onPress = async () => {
        let plotPress = await onFetchPlot();
        if (!plotPress) {
            setLoading(false);
            return;
        }
        onPressPlot(plotPress);
    };

    const onPressPlot = (plot) => {
        try {
            const centroid = plot?.isFlagged ? plot?.plot?.centroid : plot?.centroid;
            const longlat = Array.isArray(centroid) ? centroid : JSON.parse(centroid);
            navigation.push('PlotInfo', {
                plotID: plot._id || plot?.plot?._id,
                longlat,
            });
        } catch (err) {
            console.log(err);
        }
    };

    const checkWithType = (item, type) => {
        const jsonParse = JSON.parse(item?.data);
        return (
            item?.type === type &&
            !item?.isRead &&
            jsonParse?.nominatedOwner === user?.userInfo?._id
        );
    };

    // console.log('user: ', JSON.stringify(user?.userInfo, null, 2));

    // console.log('checkWithType: ', checkWithType(data, TYPES.ownershipRequestVotingApproved));
    // if (data.type === TYPES.ownershipRequestVotingApproved) {
    //     // console.log('data: ', JSON.stringify(data, null, 2));
    // }

    return (
        <>
            <Wrapper
                onPress={onPress}
                data={data}
                willReadMessage={
                    !(
                        checkWithType(data, TYPES.ownershipRequestVotingApproved) ||
                        checkWithType(data, TYPES.ownershipRequestVotingRejected)
                    )
                }
            >
                <IconWrapper>
                    <Bell color="#5EC4AC" />
                </IconWrapper>
                <Info data={data} />
            </Wrapper>
        </>
    );
}
