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

import dotenv from 'dotenv';

dotenv.config();

export const IMS_ORG_ID = process.env.ORG_ID;
export const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
export const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
export const REGION = process.env.REGION;
export const BUCKET_NAME = process.env.BUCKET_NAME;
export const ACCESS_TOKEN_URL = process.env.ACCESS_TOKEN_URL;
export const CLIENT_ID = process.env.CLIENT_ID;
