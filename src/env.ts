import * as core from '@actions/core'

export const EMAIL: string = core.getInput('email', {required: true})
export const API_TOKEN: string = core.getInput('api_token', {required: true})
export const SUBDOMAIN: string = core.getInput('subdomain', {required: true})

export const RELEASE_NAME: string = core.getInput('release_name', {
  required: false
})
export const PROJECT: string = core.getInput('jira_project', {required: true})

export const GH_USER: string = core.getInput('gh_user', {required: true})
export const GH_TOKEN: string = core.getInput('gh_token', {required: true})
export const GH_REPOSITORY: string = core.getInput('gh_repository', {required: true})

export const SLACK_TOKEN: string = core.getInput('slack_token', {required: false})
export const SLACK_CHANNEL: string = core.getInput('slack_channel', {required: false})
export const SLACK_ENVIRONMENT: string = core.getInput('slack_environment', {required: false})
export const DRY_RUN: string = core.getInput('dry_run', {required: false})
