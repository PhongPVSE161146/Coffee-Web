import React, { useState, useRef, useEffect } from 'react';
import "./Profile.css";
import TrainerInformationProfile from './components/TrainerInformationProfile';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ViewCV } from './components/ViewCV/ViewCV';
import { showErrorNotification, showInfoNotification, showSuccessNotification } from '../../components/Notifications/Notifications';
import { uploadAvatar, uploadCertificate } from './components/ApiService/ApiService';
import { useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { fetchData } from './components/ApiService/ApiService';

const ProfilePage = () => {
    const [profileSelected, setProfileSelected] = useState("information");
    const [isEditMode, setIsEditMode] = useState(false);
    const profileRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);
    const location = useLocation();
    const [isLoadingPDF, setIsLoadingPDF] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [trainerInfo, setTrainerInfo] = useState(null);

    const roleConfigs = {
        trainer: {
            path: sessionStorage.getItem("username"),
        },
        admin: {
            path: location.pathname.includes('/trainerManagement/')
                ? sessionStorage.getItem("accounttrainer")
                : sessionStorage.getItem("username"),
        },
        trainermanager: {
            path: sessionStorage.getItem("username"),
        },
        FAMadmin: {
            path: sessionStorage.getItem("username"),
        },
        deliverymanager: {
            path: location.pathname.includes('/trainerManagement/')
                ? sessionStorage.getItem("accounttrainer")
                : sessionStorage.getItem("username"),
        }

    };

    const role = sessionStorage.getItem("selectedRole");
    const { path } = roleConfigs[role] || {};


    useEffect(() => {
        const getImageWithToken = async () => {
            try {
                const token = sessionStorage.getItem("accessToken");
                const response = await fetchData(path); // Assuming fetchData is your API call

                if (response?.data?.trainerInfo?.generalInfo?.avatar) {
                    const baseImageUrl = response.data.trainerInfo.generalInfo.avatar;
                    const imageUrlWithToken = `${baseImageUrl}?token=${token}`;
                    setImageUrl(imageUrlWithToken);
                    setTrainerInfo(response.data.trainerInfo);
                }
            } catch (error) {
            }
        };

        getImageWithToken();
    }, [path]); // Add path as dependency

    // Function to toggle edit mode
    const toggleEditMode = (newState) => {
        setIsEditMode(newState);
    };

    const exportToPDF = async () => {
        let profileContent = null;

        try {
            setIsLoadingPDF(true);
            setIsEditMode(false);
            setIsExporting(true);
            profileContent = profileRef.current;

            if (!profileContent) {
                throw new Error('Profile content not found');
            }

            profileContent.classList.add('exporting-pdf');

            // Xử lý images với token
            const images = Array.from(profileContent.querySelectorAll('img'));
            const token = sessionStorage.getItem("accessToken");

            await Promise.all(images.map(img => new Promise((resolve) => {
                const originalSrc = img.src;
                if (originalSrc.includes('fams-storage.s3.amazonaws.com')) {
                    // Sử dụng URL gốc từ trainerInfo nếu có
                    const baseImageUrl = trainerInfo?.generalInfo?.avatar || originalSrc.split('?')[0];
                    const newSrc = `${baseImageUrl}?token=${token}`;
                    const newImg = new Image();
                    newImg.crossOrigin = "anonymous";
                    newImg.onload = () => {
                        img.src = newImg.src;
                        resolve();
                    };
                    newImg.onerror = () => {
                        
                        resolve();
                    };
                    newImg.src = newSrc;
                } else {
                    resolve();
                }
            })));

            const originalStyles = {
                width: profileContent.style.width,
                minWidth: profileContent.style.minWidth,
                maxWidth: profileContent.style.maxWidth,
                transform: profileContent.style.transform,
                fontSize: profileContent.style.fontSize
            };

            profileContent.style.width = '1200px';
            profileContent.style.minWidth = '1200px';
            profileContent.style.maxWidth = '1200px';
            profileContent.style.transform = 'none';
            profileContent.style.fontSize = '16px';

            const textElements = profileContent.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
            const originalColors = new Map();
            textElements.forEach(el => {
                originalColors.set(el, el.style.color);
                el.style.color = '#000000';
            });

            const canvas = await html2canvas(profileContent, {
                useCORS: true,
                allowTaint: true,
                scrollY: -window.scrollY,
                scale: 3,
                width: 1200,
                height: profileContent.scrollHeight,
                windowWidth: 1200,
                windowHeight: profileContent.scrollHeight,
                logging: false,
                backgroundColor: '#FFFFFF',
                imageTimeout: 15000,
                onclone: (clonedDoc) => {
                    const clonedElement = clonedDoc.querySelector('.profile-content');
                    if (clonedElement) {
                        clonedElement.style.width = '1200px';
                        clonedElement.style.margin = '0';
                        clonedElement.style.transform = 'none';
                        clonedElement.style.webkitFontSmoothing = 'antialiased';
                        clonedElement.style.mozOsxFontSmoothing = 'grayscale';
                        clonedElement.style.textRendering = 'optimizeLegibility';
                    }
                }
            });

            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4',
                compress: false
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 0;

            pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio, '', 'FAST');

            if (imgHeight * ratio > pdfHeight) {
                const pageCount = Math.ceil((imgHeight * ratio) / pdfHeight);
                for (let i = 1; i < pageCount; i++) {
                    pdf.addPage();
                    pdf.addImage(
                        imgData,
                        'JPEG',
                        imgX,
                        -(pdfHeight * i),
                        imgWidth * ratio,
                        imgHeight * ratio,
                        '',
                        'FAST'
                    );
                }
            }

            Object.assign(profileContent.style, originalStyles);
            textElements.forEach(el => {
                el.style.color = originalColors.get(el) || '';
            });

            pdf.save("TrainerProfile.pdf");
            showSuccessNotification("PDF exported successfully!");
        } catch (error) {
            showInfoNotification(`Failed to export PDF with error: ${error}. Please try again.`);
        } finally {
            if (profileContent) {
                profileContent.classList.remove('exporting-pdf');
            }
            setIsLoadingPDF(false);
            setIsExporting(false);
        }
    };

    const handleAvatarUpload = async (file) => {
        try {
            const response = await uploadAvatar(file);
            return response;
        } catch (error) {
            showErrorNotification(`Error uploading avatar: ${error}`)
            return null;
        }
    };

    const handleCertificateUpload = async (file) => {
        try {
            const response = await uploadCertificate(file);
            return response;
        } catch (error) {
            showErrorNotification(`Error uploading certificate: ${error}`)
            return null;
        }
    };

    return (
        <div>
            <div className='profile-header'>
                <div className='display-location-header'>
                    <div className='profile-item-header-left'>
                        <div className='h1-profile-header'>Trainer Profile</div>

                    </div>
                    <div className='profile-item-header'>
                        <div className='profile-item-header-button'>
                            {profileSelected !== 'viewCV' && (
                                <>
                                    <button
                                        onClick={exportToPDF}
                                        disabled={isLoadingPDF}
                                    >
                                        {isLoadingPDF ? (
                                            <><Spin size="small" /> Exporting...</>
                                        ) : (
                                            'Export'
                                        )}
                                    </button>
                                    {((role === "trainer") || (role === "admin") || (role === "deliverymanager" && location.pathname.includes('/trainerManagement/'))) && (<button onClick={() => setIsEditMode(true)}>Update</button>)}

                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="divider-profile"></div>
            <div className="categories-profile-items">
                <span
                    className={profileSelected === 'information' ? 'selected' : ''}
                    onClick={() => setProfileSelected('information')}
                >
                    Trainer Information
                </span>
                <span
                    className={profileSelected === 'viewCV' ? 'selected' : ''}
                    onClick={() => setProfileSelected('viewCV')}
                >
                    View CV History
                </span>
            </div>

            <div ref={profileRef}>
                {profileSelected === 'information' && (
                    <TrainerInformationProfile
                        isEditMode={isEditMode}
                        toggleEditMode={toggleEditMode}
                        isExporting={isExporting}
                        onAvatarUpload={handleAvatarUpload}
                        onCertificateUpload={handleCertificateUpload}
                    />
                )}
                {profileSelected === 'viewCV' && <ViewCV />}
            </div>
        </div>
    );
};

export default ProfilePage;
