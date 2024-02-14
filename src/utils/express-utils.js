/*************************************************************************
 * ADOBE CONFnameENTIAL
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
 * is strictly forbnameden unless prior written permission is obtained
 * from Adobe.
**************************************************************************/

export const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});


export const TemplateTypes = [
    {
        name: "Brochure",
        id: 'brochure'
    },
    {
        name: "Business card",
        id: 'business-card'
    },
    {
        name: "Card greeting",
        id: 'card-greeting'
    },
    {
        name: 'Facebook post',
        id: 'facebook-post'
    },
    {
        name: 'Facebook profile cover',
        id: 'facebook-profile-cover'
    },
    {
        name: 'Facebook story',
        id: 'facebook-story'
    },
    {
        name: 'Flyer',
        id: 'flyer'
    },
    {
        name: 'Graphic organizer',
        id: 'graphic-organizer'
    },
    {
        name: 'Infographic',
        id: 'infographic'
    },
    {
        name: 'Instagram carousel',
        id: 'instagram-carousel'
    },
    {
        name: 'Instagram story',
        id: 'instagram-story'
    },
    {
        name: 'Instagram square post',
        id: 'instagram-square-post'
    },
    {
        name: 'Instagram reel',
        id: 'instagram-reel'
    },
    {
        name: 'Invitation',
        id: 'invitation'
    },
    {
        name: 'Invoice',
        id: 'invoice'
    },
    {
        name: 'Line ad (small)',
        id: 'line-add-small'
    },
    {
        name: 'Line ad (square)',
        id: 'line-add-square'
    },
    {
        name: 'Line ad (vertical)',
        id: 'line-add-vertical'
    },
    {
        name: 'Line rich menu (large)',
        id: 'line-rich-menu-large'
    },
    {
        name: 'Line rich menu (small)',
        id: 'line-rich-menu-small'
    },
    {
        name: 'Line rich menu (vertical)',
        id: 'line-rich-menu-vertical'
    },
    {
        name: 'LinkedIn profile cover',
        id: 'linkedin-profile-cover'
    },
    {
        name: 'Logo',
        id: 'logo'
    },
    {
        name: 'Meme',
        id: 'meme'
    },
    {
        name: 'Menu',
        id: 'menu'
    },
    {
        name: 'Mobile video',
        id: 'mobile-video'
    },
    {
        name: 'Newsletter',
        id: 'newletter'
    },
    {
        name: 'Note header image',
        id: 'note-header-image'
    },
    {
        name: 'Photo book',
        id: 'photo-book'
    },
    {
        name: 'Poster',
        id: 'poster'
    },
    {
        name: 'Presentation',
        id: 'presentation'
    },
    {
        name: 'Resume',
        id: 'resume'
    },
    {
        name: 'Tiktock video',
        id: 'tiktock-video'
    },
    {
        name: 'Video',
        id: 'video'
    },
    {
        name: 'Wallpaper (desktop)',
        id: 'wallpaper-desktop'
    },
    {
        name: 'Worksheet',
        id: 'worksheet'
    },
    {
        name: 'Youtube profile photo',
        id: 'Youtube-profile-photo'
    },
    {
        name: 'Youtube thumbnail',
        id: 'youtube-thumbnail'
    },
    {
        name: 'Youtube video',
        id: 'youtube-video'
    }
];

export const QuickActions = [
    {
        name: 'Crop image',
        id: 'crop-image',
        type: 'image'
    },
    {
        name: 'Convert to JPG',
        id: 'convert-to-jpg',
        type: 'image'
    },
    {
        name: 'Convert to PNG',
        id: 'convert-to-png',
        type: 'image'
    },
    {
        name: 'Resize image',
        id: 'resize-image',
        type: 'image'
    },
    {
        name: 'Remove background',
        id: 'remove-background',
        type: 'image'
    },
    {
        name: 'Generate QR code',
        id: 'generate-qr-code',
        type: 'image'
    },
    {
        name: 'Crop video',
        id: 'crop-video',
        type: 'image'
    },
];