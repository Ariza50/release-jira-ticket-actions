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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const core = __importStar(require("@actions/core"));
const axios_1 = __importDefault(require("axios"));
class Project {
    constructor(email, token, name, domain) {
        this.email = email;
        this.token = token;
        this.name = name;
        this.domain = domain;
    }
    getVersion(rel) {
        var _a;
        if (this.project === undefined)
            return undefined;
        else {
            const result = (_a = this.project.versions) === null || _a === void 0 ? void 0 : _a.filter(i => i.name === rel);
            if (result === undefined)
                return undefined;
            if (result.length === 0) {
                return undefined;
            }
            else
                return result[0];
        }
    }
    async createVersion(version) {
        try {
            const response = await axios_1.default.post(`https://${this.domain}.atlassian.net/rest/api/3/version`, version, this._authHeaders());
            return response === null || response === void 0 ? void 0 : response.data;
        }
        catch (error) {
            return Promise.reject(toMoreDescriptiveError(error));
        }
    }
    async updateVersion(version) {
        try {
            core.debug(JSON.stringify(version));
            const response = await axios_1.default.put(`https://${this.domain}.atlassian.net/rest/api/3/version/${version.id}`, version, this._authHeaders());
            return response === null || response === void 0 ? void 0 : response.data;
        }
        catch (error) {
            return Promise.reject(toMoreDescriptiveError(error));
        }
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async updateIssue(ticket, version) {
        try {
            const response = await axios_1.default.put(`https://${this.domain}.atlassian.net/rest/api/3/issue/${ticket}`, {
                update: {
                    fixVersions: [
                        {
                            add: { id: version }
                        }
                    ]
                }
            }, this._authHeaders());
            return response === null || response === void 0 ? void 0 : response.data;
        }
        catch (error) {
            return Promise.reject(toMoreDescriptiveError(error));
        }
    }
    static async create(email, token, name, domain) {
        const result = new Project(email, token, name, domain);
        return result._load();
    }
    async _load() {
        try {
            const response = await axios_1.default.get(`https://${this.domain}.atlassian.net/rest/api/3/project/${this.name}?properties=versions,key,id,name`, this._authHeaders());
            this.project = response === null || response === void 0 ? void 0 : response.data;
            return this;
        }
        catch (error) {
            return Promise.reject(toMoreDescriptiveError(error));
        }
    }
    _authHeaders() {
        const authHeader = `Basic ${Buffer.from(`${this.email}:${this.token}`).toString('base64')}`;
        core.info(`authHeader: ${authHeader}`);
        return {
            headers: {
                Authorization: authHeader,
                Accept: 'application/json'
            }
        };
    }
}
exports.Project = Project;
const toMoreDescriptiveError = (error) => {
    var _a, _b, _c;
    if (isAxiosError(error) &&
        ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404 &&
        // @ts-ignore
        Array.isArray((_b = error.response.data) === null || _b === void 0 ? void 0 : _b.errorMessages)) {
        return new Error(
        // @ts-ignore
        `${(_c = error.response.data) === null || _c === void 0 ? void 0 : _c.errorMessages[0]} (this may be due to a missing/invalid API key)`);
    }
    else {
        core.debug(`error: ${error}`);
        return error;
    }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAxiosError = (error) => { var _a; return (_a = error === null || error === void 0 ? void 0 : error.isAxiosError) !== null && _a !== void 0 ? _a : false; };
