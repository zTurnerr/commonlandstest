import { Pressable } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, VirtualizedList } from 'react-native';

const PADDING = 16;

/**
 * @typedef {{
 * data: any[],
 * width: number,
 * size: number,
 * isLoading: boolean,
 * itemProps?: any,
 * renderItem: React.ComponentType,
 * onChangeIndex: (index: number) => void,
 * }} Props
 * @extends {Component<Props>}
 */
class Swiper extends Component {
    /**
     * @param {Props} props
     */
    constructor(props) {
        super(props);

        this.index = React.createRef();
        this.index.current = 0;
        this.screenWidth = Dimensions.get('window').width;
        /**
         * @type {React.RefObject<VirtualizedList>}
         */
        this.listRef = React.createRef();
    }

    /**
     * @description Handle scroll event
     * @param {import('react-native').NativeSyntheticEvent<import('react-native').NativeScrollEvent>} event
     */
    handleScroll = ({ nativeEvent: { contentOffset, layoutMeasurement } }) => {
        if (contentOffset.x < 0) return;

        const contentWidth = this.props.width; // Width of item
        const centeredPadding = (layoutMeasurement.width - contentWidth) / 2; // Padding for centering item
        const xOffset = contentOffset.x + centeredPadding * 2;
        /**
         * |                   |                                   |                   |
         * |                   |                                   |                   |
         * | <--- Padding ---> | <-------- Content width --------> | <--- Padding ---> |
         * |                   |                                   |                   |
         * |                   |                                   |                   |
         * | <----------------------- layoutMeasurement.width -----------------------> |
         * |                   |                                   |                   |
         *      <-- x-offset -->
         *      |                                   |                   |
         *      |                                   |                   |
         *      | <-------- Content width --------> | <--- Padding ---> |
         *      |                                   |                   |
         *      |                                   |                   |
         * ----------- layoutMeasurement.width -----------------------> |
         */

        const newIndex = Math.floor(xOffset / contentWidth);

        if (this.index.current === newIndex) {
            // Prevent duplicate index
            return;
        }

        this.index.current = newIndex; // Update index

        this.props.onChangeIndex(newIndex);
    };

    /**
     * @description Check if component should update
     * @param {Props} nextProps
     * @returns {boolean}
     */
    shouldComponentUpdate(nextProps) {
        if (this.index.current >= nextProps.data.length) {
            this.listRef.current.scrollToIndex({
                index: 0,
                viewPosition: 0.5,
            });
        }
        return nextProps.isLoading !== this.props.isLoading || nextProps.data !== this.props.data;
    }

    render() {
        const RenderItem = this.props.renderItem;

        return (
            <View style={styles.wrapper}>
                <VirtualizedList
                    ref={(ref) => {
                        this.listRef.current = ref;
                        if (this.props.innerRef) this.props.innerRef.current = ref;
                    }}
                    getItemCount={() => this.props.data.length}
                    getItem={(data, index) => {
                        return data[index];
                    }}
                    data={this.props.data}
                    renderItem={(p) => {
                        return (
                            <Pressable
                                key={p.item._id || p.index}
                                flexDirection="row"
                                onPress={() =>
                                    this.listRef.current.scrollToIndex({
                                        index: p.index,
                                        viewPosition: 0.5,
                                    })
                                }
                                disabled={this.props.isLoading}
                            >
                                <RenderItem
                                    {...p}
                                    isLoading={this.props.isLoading}
                                    {...this.props.itemProps}
                                />
                            </Pressable>
                        );
                    }}
                    keyExtractor={(_item, index) => _item._id || index}
                    horizontal
                    pagingEnabled
                    scrollEnabled={!this.props.isLoading}
                    contentContainerStyle={{
                        paddingHorizontal:
                            this.props.size === 1
                                ? (this.screenWidth - this.props.width) / 2
                                : PADDING,
                    }}
                    snapToAlignment="center"
                    onScroll={this.handleScroll}
                    showsHorizontalScrollIndicator={false}
                    initialNumToRender={2}
                />
            </View>
        );
    }
}

export default React.forwardRef((props, ref) => <Swiper {...props} innerRef={ref} />);

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
});
