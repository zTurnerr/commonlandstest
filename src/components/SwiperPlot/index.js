import { Box, Image, PresenceTransition } from 'native-base';
import React, { forwardRef, useCallback, useEffect, useMemo } from 'react';
import { Dimensions } from 'react-native';
import headerPlotInfoImage from '../../images/headerPlotInfo.png';
import PlotInfoSkeleton from '../Explore/PlotInfoSkeleton';
import PlotInfoForm from '../PlotInfoForm';
import Swiper from './Swiper';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_NAME } from '../../constants/eventName';

/**
 * @typedef {{
 * item: any,
 * isLoading: boolean,
 * _width: number,
 * onPressPlot: (item: any) => void,
 * showStatusScale: boolean,
 * isMyPlotScreen: boolean,
 * claimchainSize: number,
 * }} RenderPlotCardProps
 * @extends {React.PureComponent<RenderPlotCardProps>}
 */
class RenderPlotCard extends React.PureComponent {
    render() {
        const {
            item: plot,
            isLoading,
            _width,
            onPressPlot,
            showStatusScale,
            isMyPlotScreen,
            claimchainSize,
        } = this.props;

        return (
            <>
                <PresenceTransition
                    visible
                    initial={{ opacity: 0.5, scale: 0.95 }}
                    animate={{
                        opacity: 1,
                        transition: {
                            type: 'spring',
                            useNativeDriver: true,
                        },
                    }}
                >
                    {!isLoading && (
                        <Box key={plot._id} alignItems="center" h="full" w={_width} px={'8px'}>
                            <Box
                                w={'full'}
                                h="full"
                                backgroundColor="white"
                                pb="10px"
                                borderRadius="12px"
                                overflow="hidden"
                            >
                                <Image
                                    source={headerPlotInfoImage}
                                    w="full"
                                    h="50px"
                                    mb="8px"
                                    alt="header"
                                />
                                <Box px="12px">
                                    <PlotInfoForm
                                        onPress={() => onPressPlot(plot)}
                                        plotData={{ plot }}
                                        showOwner
                                        showStatus={plot?.isFlagged ? false : true}
                                        isFlagged={plot?.isFlagged}
                                        showStatusScale={showStatusScale}
                                        numberClaimchain={
                                            isMyPlotScreen ? plot.claimchainSize : claimchainSize
                                        }
                                        isLoading={isLoading}
                                        scrollTag={false}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    )}
                </PresenceTransition>
                {isLoading && (
                    <PresenceTransition initial={{ scale: 0.95 }}>
                        <Box px="8px" h="full" w={_width}>
                            <PlotInfoSkeleton />
                        </Box>
                    </PresenceTransition>
                )}
            </>
        );
    }
}

const Index = (
    { claimchain, onPressPlot, onChangePlot, isLoading, showStatusScale, isMyPlotScreen },
    ref,
) => {
    const { width } = Dimensions.get('window');
    const padding = 40;
    let _width = useMemo(() => width - padding * 2, [width, padding]);
    const onChange = useCallback(
        (index) => {
            if (index === 0) {
                setTimeout(() => ref?.current?.scrollToIndex({ index: 0 }), 300);
            }
            let item = claimchain?.plots?.[index] || claimchain?.plots?.[index]?.plot;
            if (!item) return;

            onChangePlot
                ? onChangePlot({
                      item,
                      index,
                  })
                : null;
        },
        [claimchain, onChangePlot],
    );

    useEffect(() => {
        const listener = EventRegister.addEventListener(EVENT_NAME.refreshPlotList, () => {
            onChange(0);
        });
        return () => {
            EventRegister.removeEventListener(listener);
        };
    }, [onChange]);

    return (
        <Box w="full" mb="12px">
            {!!claimchain?.plots.length && (
                <>
                    {/* <Carousel
                        data={claimchain?.plots}
                        renderItem={renderItem}
                        sliderWidth={
                            _width * (claimchain.plots.length - 1 || 1)
                        }
                        itemWidth={_width}
                        itemHeight={260}
                        sliderHeight={260}
                        enableSnap
                        layout={'default'}
                    /> */}
                    <Swiper
                        ref={ref}
                        data={claimchain.plots}
                        width={_width}
                        size={claimchain.size}
                        isLoading={isLoading}
                        onChangeIndex={onChange}
                        renderItem={RenderPlotCard}
                        itemProps={{
                            _width,
                            onPressPlot,
                            showStatusScale,
                            isMyPlotScreen,
                            claimchainSize: claimchain.size,
                        }}
                    />
                </>
            )}
        </Box>
    );
};
export default forwardRef(Index);
