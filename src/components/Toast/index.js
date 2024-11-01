import { Danger, InfoCircle, TickCircle } from 'iconsax-react-native';
import { HStack, PresenceTransition, Text, VStack, useTheme } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { deviceEvents } from '../../util/Constants';

/**
 * @typedef {{
 * message: string
 * type: 'success' | 'error' | 'warning' | 'info'
 * duration?: number
 * id?: number
 * }} Content
 */

export class Toast {
    /**
     * @description Show a toast message
     * @param {Content} content - The content to show
     */
    show({ message, type = 'info', duration = 5000 }) {
        DeviceEventEmitter.emit(deviceEvents.app.toast, { message, type, duration });
    }

    /**
     * @description Show an info toast message
     * @param {string} message - The message to show
     * @param {number?} duration - The duration to show the message
     */
    info(message, duration) {
        this.show({ message, type: 'info', duration });
    }

    /**
     * @description Show an success toast message
     * @param {string} message - The message to show
     * @param {number?} duration - The duration to show the message
     */
    success(message, duration) {
        this.show({ message, type: 'success', duration });
    }

    /**
     * @description Show an error toast message
     * @param {string} message - The message to show
     * @param {number?} duration - The duration to show the message
     */
    error(message, duration) {
        this.show({ message, type: 'error', duration });
    }

    /**
     * @description Show an warning toast message
     * @param {string} message - The message to show
     * @param {number?} duration - The duration to show the message
     */
    warning(message, duration) {
        this.show({ message, type: 'warning', duration });
    }
}

export const toast = new Toast();

/**
 * @type {Record<Content['type'], React.Component>}
 */
const icons = {
    error: InfoCircle,
    info: InfoCircle,
    success: TickCircle,
    warning: Danger,
};

let lastId = 0;

export default function ToastContainer() {
    const theme = useTheme();

    /**
     * @type {[Content[], (content: Content[]) => void]
     */
    const [contents, setContents] = useState([]);

    const pushContent = useCallback(
        /**
         * @param {Content} content
         * @returns {Content}
         */
        (content) => {
            content.id = ++lastId;
            setContents((prev) => [...prev, content]);
            return content;
        },
        [],
    );

    const popContent = useCallback(
        /**
         * @param {number} id  - The id of the content to remove
         */
        (id) => {
            setContents((prev) => prev.filter((content) => content.id !== id));
        },
        [contents],
    );

    useEffect(() => {
        const timers = [];
        // Listen for toast events
        DeviceEventEmitter.addListener(
            deviceEvents.app.toast,
            /**
             * @param {Content} data
             */
            (data) => {
                const newContent = pushContent(data);
                const timer = setTimeout(() => popContent(newContent.id), newContent.duration);
                timers.push(timer);
            },
        );
        return () => {
            DeviceEventEmitter.removeAllListeners(deviceEvents.app.toast);
            timers.forEach((timer) => clearTimeout(timer));
            setContents([]);
        };
    }, []);

    return (
        <VStack position="absolute" bottom="0" w="full" mb="48px">
            {contents.map((content) => {
                const Icon = icons[content.type] || icons['info'];
                const color =
                    theme.colors[content.type || 'info'][content.type === 'warning' ? 400 : 600];
                return (
                    <PresenceTransition
                        key={content.id}
                        visible
                        initial={{
                            opacity: 0,
                            translateY: 100,
                        }}
                        animate={{
                            opacity: 1,
                            translateY: 0,
                        }}
                    >
                        <HStack
                            bgColor="white"
                            px="16px"
                            py="12px"
                            zIndex={100}
                            mx="16px"
                            shadow="1"
                            borderRadius="xl"
                            space="4px"
                            alignItems="center"
                            mt="12px"
                        >
                            <Icon size={22} variant="Bold" color={color} />
                            <Text flex={1} fontSize="12px" fontWeight="500" lineHeight="20px">
                                {content.message}
                            </Text>
                            <MaterialCommunityIcons
                                name="close"
                                size={20}
                                color={theme.colors.muted[500]}
                                onPress={() => popContent(content.id)}
                            />
                        </HStack>
                    </PresenceTransition>
                );
            })}
        </VStack>
    );
}
