import { notification } from "antd";
export const handleSuccessNotification = (message: string) => {
    notification.success({
        message,
    });
};
export const handleErrorNotification = (message: string) => {
    notification.error({
        message,
    });
}