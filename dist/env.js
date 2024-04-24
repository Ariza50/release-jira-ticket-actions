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
exports.DRY_RUN = exports.SLACK_ENVIRONMENT = exports.SLACK_CHANNEL = exports.SLACK_TOKEN = exports.GH_REPOSITORY = exports.GH_TOKEN = exports.GH_USER = exports.PROJECT = exports.RELEASE_PREFIX = exports.RELEASE_NAME = exports.SUBDOMAIN = exports.API_TOKEN = exports.EMAIL = void 0;
const core = __importStar(require("@actions/core"));
exports.EMAIL = core.getInput('email', { required: true });
exports.API_TOKEN = core.getInput('api_token', { required: true });
exports.SUBDOMAIN = core.getInput('subdomain', { required: true });
exports.RELEASE_NAME = core.getInput('release_name', {
    required: true
});
exports.RELEASE_PREFIX = core.getInput('release_prefix', {
    required: true
});
exports.PROJECT = core.getInput('jira_project', { required: true });
exports.GH_USER = core.getInput('gh_user', { required: true });
exports.GH_TOKEN = core.getInput('gh_token', { required: true });
exports.GH_REPOSITORY = core.getInput('gh_repository', { required: true });
exports.SLACK_TOKEN = core.getInput('slack_token', { required: false });
exports.SLACK_CHANNEL = core.getInput('slack_channel', { required: false });
exports.SLACK_ENVIRONMENT = core.getInput('slack_environment', { required: false });
exports.DRY_RUN = core.getInput('dry_run', { required: false });
