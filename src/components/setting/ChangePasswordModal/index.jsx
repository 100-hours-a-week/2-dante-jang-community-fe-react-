import React, { useState } from 'react';
import { changePasswordRequest, checkPasswordRequest } from '../../../apis/user';

export const PasswordChangeModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState('current');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCurrentPasswordSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await checkPasswordRequest(currentPassword);
            if (response.isMatch) {
                setStep('new');
            }
        } catch (err) {
            setError('현재 비밀번호가 일치하지 않습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewPasswordSubmit = async (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 8) {
            setError("비밀번호는 8자리 이상이어야 합니다.");
            return;
        } else if (!/[a-z]/.test(newPassword)) {
            setError("비밀번호에 소문자가 포함되어야 합니다.");
            return;
        } else if (!/[A-Z]/.test(newPassword)) {
            setError("비밀번호에 대문자가 포함되어야 합니다.");
            return;
        } else if (!/\d/.test(newPassword)) {
            setError("비밀번호에 숫자가 포함되어야 합니다.");
            return;
        } else if (!/[!@#$%^&*]/.test(newPassword)) {
            setError("비밀번호에 특수 문자가 포함되어야 합니다.");
            return;
        } else if (newPassword !== confirmPassword) {
            setError('새 비밀번호가 일치하지 않습니다.');
            return;
        } else if (currentPassword === newPassword) {
            setError('기존의 비밀번호와 일치하지 않습니다.');
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const response = await changePasswordRequest(
                newPassword, 
                confirmPassword
            );
            if (response) {
                close()
                alert("비밀번호가 변경되었습니다.");
            }
        } catch (err) {
            setError('비밀번호 변경 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const close = () => {
        onClose();
        setStep('current');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    }

    if (!isOpen) return null;

    return (
        <div style={styles.modal}>
            <div style={styles.modalContent}>
                <h2 style={styles.title}>비밀번호 변경</h2>
                {step === 'current' ? (
                    // 비밀번호 확인
                    <form onSubmit={handleCurrentPasswordSubmit}>
                        <div style={styles.inputGroup}>
                            <label htmlFor="current-password">현재 비밀번호</label>
                            <input 
                                id="current-password" 
                                type="password" 
                                value={currentPassword} 
                                onChange={(e) => setCurrentPassword(e.target.value)} 
                                required style={styles.input} 
                            />
                        </div>
                        {error && <p style={styles.error}>{error}</p>}
                        <div style={styles.buttonGroup}>
                            <button type="button" onClick={close} style={styles.button}>
                                취소
                            </button>
                            <button type="submit" disabled={isLoading} style={styles.button}>
                                {isLoading ? '확인 중...' : '다음'}
                            </button>
                        </div>
                    </form>
                ) : (
                    // 비밀번호 변경
                    <form onSubmit={handleNewPasswordSubmit}>
                        <div style={styles.inputGroup}>
                            <label htmlFor="new-password">새 비밀번호</label>
                            <input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label htmlFor="confirm-password">새 비밀번호 확인</label>
                            <input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={styles.input}
                            />
                        </div>
                        {error && <p style={styles.error}>{error}</p>}
                        <div style={styles.buttonGroup}>
                            <button type="button" onClick={close} style={styles.button}>
                                취소
                            </button>
                            <button type="submit" disabled={isLoading} style={styles.button}>
                                {isLoading ? '변경 중...' : '비밀번호 변경'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

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
    },
    modalContent: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        width: '80%',
        maxWidth: '25rem',
    },
    title: {
        marginTop: 0,
        marginBottom: '1rem',
        textAlign: 'center',
        fontSize: '1.25rem',
    },
    inputGroup: {
        marginBottom: '1rem',
    },
    input: {
        width: '100%',
        padding: '0.5rem',
        marginTop: '0.5rem',
        border: '0.0625rem solid #ccc',
        borderRadius: '0.25rem',
        fontSize: '1rem',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '1rem',
        gap: '0.75rem',
    },
    button: {
        padding: '0.75rem 1.5rem',
        border: 'none',
        borderRadius: '0.25rem',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: 'white',
        fontSize: '1rem',
    },
    error: {
        color: 'red',
        marginTop: '0.5rem',
        fontSize: '0.875rem',
    },
};