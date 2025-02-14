// src/components/Notification.js

import { notification } from 'antd';

// Function to display success notification
export const showSuccessNotification = (message, description) => {
    notification.success({
        message,
        description,
        placement: 'topRight',
    });
};

// Function to display error notification
export const showErrorNotification = (message, description) => {
    notification.error({
        message,
        description,
        placement: 'topRight',
    });
};

// Function to display info notification
export const showInfoNotification = (message, description) => {
    notification.info({
        message,
        description,
        placement: 'topRight',
    });
};

// Function to display warning notification
export const showWarningNotification = (message, description) => {
    notification.warning({
        message,
        description,
        placement: 'topRight',
    });
};
