import React from 'react';
import { useNavigate } from "react-router-dom";
import { deleteUserRequsest } from '../../../apis/user';
import { MAIN_PATH } from "../../../constants";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../stores/userSlice";

export const DeleteConfirmationModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const deleteUser = async () => {
        try {
            const response = await deleteUserRequsest();
            if (response) {
                navigate(MAIN_PATH());
                dispatch(logoutUser());
            }
        } catch (error) {
            alert("회원탈퇴에 실패했습니다.")
        }
    }

    if (!isOpen) return null;

    return (
        <div style={styles.modal}>
            <div style={styles.modalContent}>
                <h2 style={styles.title}>계정 탈퇴</h2>
                <p style={styles.message}>정말 탈퇴하시겠습니까?</p>
                <p style={styles.warning}>이 작업은 되돌릴 수 없습니다.</p>
                <div style={styles.buttonGroup}>
                    <button onClick={onClose} style={styles.cancelButton}>
                        취소
                    </button>
                    <button onClick={deleteUser} style={styles.deleteButton}>
                        탈퇴
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    modal: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        width: '300px',
        textAlign: 'center',
    },
    title: {
        marginTop: 0,
        marginBottom: '20px',
        color: '#333',
    },
    message: {
        marginBottom: '10px',
        fontSize: '16px',
    },
    warning: {
        color: 'red',
        marginBottom: '20px',
        fontSize: '14px',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'space-around',
    },
    cancelButton: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#6c757d',
        color: 'white',
        cursor: 'pointer',
    },
    deleteButton: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#dc3545',
        color: 'white',
        cursor: 'pointer',
    },
};