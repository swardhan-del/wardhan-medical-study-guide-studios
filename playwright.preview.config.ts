import { defineConfig } from '@playwright/test';
import local from './playwright.config';
const baseURL = process.env.CHECK_BASE_URL;
if (!baseURL || !/^https:\/\//.test(baseURL)) throw new Error('Set CHECK_BASE_URL to the HTTPS preview origin.');
export default defineConfig({
 ...local,
 webServer: undefined,
 timeout: 60000,
 projects: local.projects?.filter(p => p.name !== 'local-review').map(p => ({...p, testMatch: /(?:directory|figures)\.spec\.ts/, use: {...p.use, baseURL, storageState: process.env.PREVIEW_STORAGE_STATE}})),
});
