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
const jira_api_1 = require("./jira.api");
const github_api_1 = require("./github.api");
async function run() {
    var _a, _b, _c;
    try {
        if (env_1.DRY_RUN === 'ci') {
            core.info(`email ${env_1.EMAIL}`);
            core.info(`project ${env_1.PROJECT}`);
            core.info(`subdomain ${env_1.SUBDOMAIN}`);
            core.info(`releaseName ${env_1.RELEASE_NAME}`);
            core.info(`GH User ${env_1.GH_USER}`);
            core.info(`Repository ${env_1.GH_REPOSITORY}`);
            return;
        }
        if (env_1.DRY_RUN === 'true') {
            core.info(`email ${env_1.EMAIL}`);
            core.info(`project ${env_1.PROJECT}`);
            core.info(`subdomain ${env_1.SUBDOMAIN}`);
            core.info(`releaseName ${env_1.RELEASE_NAME}`);
            core.info(`GH User ${env_1.GH_USER}`);
            core.info(`Repository ${env_1.GH_REPOSITORY}`);
            const project = await jira_api_1.Project.create(env_1.EMAIL, env_1.API_TOKEN, env_1.PROJECT, env_1.SUBDOMAIN);
            core.info(`Project loaded ${(_a = project.project) === null || _a === void 0 ? void 0 : _a.id}`);
            const version = project.getVersion(env_1.RELEASE_NAME);
            const tickets = await (0, github_api_1.getTicketsFromCommits)();
            core.info(`Final tickets ${tickets.size}`);
            tickets.forEach(ticket => {
                core.info(`Ticket ${ticket}`);
            });
            await project.updateIssue('DB-2', '2.0.2');
            if (version === undefined) {
                core.info(`Version ${env_1.RELEASE_NAME} not found`);
            }
            else {
                core.info(`Version ${env_1.RELEASE_NAME} found`);
            }
            return;
        }
        const tickets = await (0, github_api_1.getTicketsFromCommits)();
        const project = await jira_api_1.Project.create(env_1.EMAIL, env_1.API_TOKEN, env_1.PROJECT, env_1.SUBDOMAIN);
        core.debug(`Project loaded ${(_b = project.project) === null || _b === void 0 ? void 0 : _b.id}`);
        let version = project.getVersion(env_1.RELEASE_NAME);
        if (version === undefined) {
            core.debug(`Version ${env_1.RELEASE_NAME} not found`);
            core.debug(`Version ${env_1.RELEASE_NAME} is going to the created`);
            const versionToCreate = {
                name: env_1.RELEASE_NAME,
                archived: false,
                released: false,
                releaseDate: new Date().toISOString(),
                projectId: Number((_c = project.project) === null || _c === void 0 ? void 0 : _c.id)
            };
            version = await project.createVersion(versionToCreate);
            core.debug(versionToCreate.name);
        }
        else {
            core.debug(`Version ${env_1.RELEASE_NAME} found and is going to be updated`);
            const versionToUpdate = {
                ...version,
                self: undefined,
                released: false,
                releaseDate: new Date().toISOString(),
                userReleaseDate: undefined
            };
            version = await project.updateVersion(versionToUpdate);
        }
        if (tickets.size > 0) {
            tickets.forEach(ticket => {
                core.debug(`Going to update ticket ${ticket} with version ${version === null || version === void 0 ? void 0 : version.name}`);
                if ((version === null || version === void 0 ? void 0 : version.id) !== undefined)
                    project.updateIssue(ticket, env_1.RELEASE_NAME);
            });
        }
    }
    catch (error) {
        const e = error;
        core.setFailed(e);
    }
}
run();
