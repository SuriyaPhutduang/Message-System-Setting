import React from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const AlertComponent = (props: any) => {
    const { collectionName, url, fetchItems, setModal, actions, body, btnClassName, buttonText } = props;

    const processMethod = async () => {
        try {
            if (actions == 'delete') {
                const response = await axios.delete(`${url}`);
                const responseStatus = response.data.status;
                switch (responseStatus) {
                    case 200:
                        showMessage(`${collectionName} has been successfully deleted!`, 'success');
                        break;
                    case 102:
                    case 201:
                        showMessage(`Failed to delete ${collectionName.toLocaleLowerCase()}, Please try again.`, 'warning');
                        break;
                    case 500:
                    case 501:
                        showMessage('Sorry... Something went wrong, We are working on a fix.', 'error');
                        break;
                    case 403:
                        showMessage(`Oops! Something went wrong. Please contact the administrator.`, 'error');
                        break;
                    case 104:
                    case 103:
                    case 101:
                    case 100:
                        showMessage('Oops, Please contact administrator.', 'error');
                        break;
                    default:
                        showMessage('An unexpected error occurred. Please try again.', 'error');
                }
            } else if (actions == 'create') {
                const response = await axios.post(`${url}`, body);
                const responseStatus = response.data.status;
                switch (responseStatus) {
                    case 200:
                        showMessage(`${collectionName} has been successfully created!`, 'success');
                        break;
                    case 202:
                        showMessage(`This ${collectionName.toLocaleLowerCase()} is already in use, Please use a different name.`, 'warning');
                        break;
                    case 102:
                    case 201:
                        showMessage(`Failed to create ${collectionName.toLocaleLowerCase()}, Please try again.`, 'warning');
                        break;
                    case 500:
                    case 501:
                        showMessage('Sorry... Something went wrong, We are working on a fix.', 'error');
                        break;
                    case 403:
                        showMessage(`Oops! Something went wrong. Please contact the administrator.`, 'error');
                        break;
                    case 104:
                    case 103:
                    case 101:
                    case 100:
                        showMessage('Oops, Please contact administrator.', 'error');
                        break;
                    default:
                        showMessage('An unexpected error occurred. Please try again.', 'error');
                }
            } else if (actions == 'update') {
                const response = await axios.patch(`${url}`, body);
                const responseStatus = response.data.status;
                switch (responseStatus) {
                    case 200:
                        showMessage(`${collectionName} has been successfully updated!`, 'success');
                        break;
                    case 102:
                    case 201:
                        showMessage(`Failed to update ${collectionName.toLocaleLowerCase()}, Please try again.`, 'warning');
                        break;
                    case 202:
                        showMessage(`This ${collectionName.toLocaleLowerCase()} is already in use, Please use a different name.`, 'warning');
                        break;
                    case 500:
                    case 501:
                        showMessage('Sorry... Something went wrong, We are working on a fix.', 'error');
                        break;
                    case 403:
                        showMessage(`Oops! Something went wrong. Please contact the administrator.`, 'error');
                        break;
                    case 104:
                    case 103:
                    case 101:
                    case 100:
                        showMessage('Oops, Please contact administrator.', 'error');
                        break;
                    default:
                        showMessage('An unexpected error occurred. Please try again.', 'error');
                }
            }
            fetchItems();
            setModal(false);
        } catch (error) {
            console.error('Error fetching data: ', error);
            showMessage('An unexpected error occurred. Please try again.', 'error');
            setModal(false);
        }
    };

    const showMessage = (msg = '', type = '') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    return (
        <button onClick={() => processMethod()} type="button" className={btnClassName}>
            {buttonText}
        </button>
    );
};

export default AlertComponent;
