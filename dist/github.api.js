"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTicketsFromCommits = void 0;
const github_1 = require("@actions/github");
const env_1 = require("./env");
const getTicketsFromCommits = async () => {
    const github = (0, github_1.getOctokit)(env_1.GH_TOKEN);
    const tags = await github.rest.repos.listTags({ owner: env_1.GH_USER, repo: env_1.GH_REPOSITORY });
    const uniqueTickets = new Set();
    await github.rest.repos.compareCommits({ owner: env_1.GH_USER, repo: env_1.GH_REPOSITORY, base: tags.data[1].commit.sha, head: tags.data[0].commit.sha }).then(compare => {
        const JIRA_REGEX = /(?<!([A-Z]{1,10})-?)[A-Z]+-\d+/;
        compare.data.commits.forEach((commit) => {
            const matches = commit.commit.message.match(JIRA_REGEX);
            matches === null || matches === void 0 ? void 0 : matches.forEach((match) => {
                if (match !== undefined)
                    uniqueTickets.add(match);
            });
        });
    });
    return uniqueTickets;
};
exports.getTicketsFromCommits = getTicketsFromCommits;
