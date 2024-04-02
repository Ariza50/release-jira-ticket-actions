"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const env_1 = require("./env");
const api_1 = require("./api");
async function run() {
    var _a, _b, _c;
    try {
        if (env_1.DRY_RUN === 'ci') {
            core.info(`email ${env_1.EMAIL}`);
            core.info(`project ${env_1.PROJECT}`);
            core.info(`subdomain ${env_1.SUBDOMAIN}`);
            core.info(`release ${env_1.RELEASE_NAME}`);
            core.info(`create ${env_1.CREATE}`);
            core.info(`tickets ${env_1.TICKETS}`);
            return;
        }
        if (env_1.DRY_RUN === 'true') {
            core.info(`email ${env_1.EMAIL}`);
            core.info(`project ${env_1.PROJECT}`);
            core.info(`subdomain ${env_1.SUBDOMAIN}`);
            core.info(`release ${env_1.RELEASE_NAME}`);
            core.info(`create ${env_1.CREATE}`);
            core.info(`tickets ${env_1.TICKETS}`);
            const project = await api_1.Project.create(env_1.EMAIL, env_1.API_TOKEN, env_1.PROJECT, env_1.SUBDOMAIN);
            core.info(`Project loaded ${(_a = project.project) === null || _a === void 0 ? void 0 : _a.id}`);
            const version = project.getVersion(env_1.RELEASE_NAME);
            if (version === undefined) {
                core.info(`Version ${env_1.RELEASE_NAME} not found`);
            }
            else {
                core.info(`Version ${env_1.RELEASE_NAME} found`);
            }
            return;
        }
        const project = await api_1.Project.create(env_1.EMAIL, env_1.API_TOKEN, env_1.PROJECT, env_1.SUBDOMAIN);
        core.debug(`Project loaded ${(_b = project.project) === null || _b === void 0 ? void 0 : _b.id}`);
        let version = project.getVersion(env_1.RELEASE_NAME);
        if (version === undefined) {
            core.debug(`Version ${env_1.RELEASE_NAME} not found`);
            if (env_1.CREATE === 'true') {
                core.debug(`Version ${env_1.RELEASE_NAME} is going to the created`);
                const versionToCreate = {
                    name: env_1.RELEASE_NAME,
                    archived: false,
                    released: true,
                    releaseDate: new Date().toISOString(),
                    projectId: Number((_c = project.project) === null || _c === void 0 ? void 0 : _c.id)
                };
                version = await project.createVersion(versionToCreate);
                core.debug(versionToCreate.name);
            }
        }
        else {
            core.debug(`Version ${env_1.RELEASE_NAME} found and is going to be updated`);
            const versionToUpdate = {
                ...version,
                self: undefined,
                released: true,
                releaseDate: new Date().toISOString(),
                userReleaseDate: undefined
            };
            version = await project.updateVersion(versionToUpdate);
        }
        if (env_1.TICKETS !== '') {
            const tickets = env_1.TICKETS.split(',');
            // eslint-disable-next-line github/array-foreach
            tickets.forEach(ticket => {
                core.debug(`Going to update ticket ${ticket}`);
                if ((version === null || version === void 0 ? void 0 : version.id) !== undefined)
                    project.updateIssue(ticket, version === null || version === void 0 ? void 0 : version.id);
            });
        }
    }
    catch (error) {
        const e = error;
        core.setFailed(e);
    }
}
run();
