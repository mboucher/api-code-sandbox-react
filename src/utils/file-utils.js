/* ************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2024 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
**************************************************************************/

export const FILETYPE = {
    image: 'IMAGE',
    action: 'ACTION',
    preset: 'PRESET',
    document: 'DOCUMENT'
};

const imageExtensions = ["png", "jpg", "jpeg", "tiff"];

export const getFileType = (file) => {
    const extension = file.toLowerCase().split('.')[1];
    if (imageExtensions.indexOf(extension) !== -1) {
       return FILETYPE.image; 
    } 
    if (extension === 'xmp') {
        return FILETYPE.preset; 
    }  
    if(extension === 'atn') {
        return FILETYPE.action;
    }
    if(extension === 'psd') {
        return FILETYPE.document;
    }
}