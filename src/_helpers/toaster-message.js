import { Store } from 'react-notifications-component';
export class notify {
  static restConfig = {
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__zoomOut"],
      dismiss: {
        duration: 3000,
        onScreen: false,
        pauseOnHover: true,
        showIcon:true
      }
  }
  static success = (message) => {
    Store.addNotification({
      ...this.restConfig,
      title: 'Success',
      message: message,
      type: 'success'
    });
  }

  static error = (message) => {
    Store.addNotification({
      ...this.restConfig,
      title: 'Error',
      message: message,
      type: 'danger'
    });
  }

  static info = (message) => {
    Store.addNotification({
      ...this.restConfig,
      title: 'Info',
      message: message,
      type: 'info'
    });
  }
}