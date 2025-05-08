import Toast from 'react-native-toast-message';
export default function ToastComponent(type,text1) {
    Toast.show({
        type:type,
        text1:text1
    })
}