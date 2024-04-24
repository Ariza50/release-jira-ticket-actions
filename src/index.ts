import * as core from '@actions/core'

import {
  EMAIL,
  API_TOKEN,
  SUBDOMAIN,
  RELEASE_NAME,
  PROJECT,
  DRY_RUN,
  GH_USER,
  GH_REPOSITORY, SLACK_TOKEN, SLACK_CHANNEL, RELEASE_PREFIX
} from './env'
import {Project} from './jira.api'
import {Version} from './models'
import {getTicketsFromCommits} from './github.api'
import {sendNewReleaseMessage} from './slack.api'

async function run(): Promise<void> {
  try {
    if (DRY_RUN === 'ci') {
      core.info(`email ${EMAIL}`)
      core.info(`project ${PROJECT}`)
      core.info(`subdomain ${SUBDOMAIN}`)
      core.info(`releaseName ${RELEASE_NAME}`)
      core.info(`GH User ${GH_USER}`)
      core.info(`Repository ${GH_REPOSITORY}`)

      return
    }

    if (DRY_RUN === 'true') {
      core.info(`email ${EMAIL}`)
      core.info(`project ${PROJECT}`)
      core.info(`subdomain ${SUBDOMAIN}`)
      core.info(`releaseName ${RELEASE_NAME}`)
      core.info(`GH User ${GH_USER}`)
      core.info(`Repository ${GH_REPOSITORY}`)
      const project = await Project.create(EMAIL, API_TOKEN, PROJECT, SUBDOMAIN)
      core.info(`Project loaded ${project.project?.id}`)
      const version = project.getVersion(RELEASE_NAME)

      const tickets = await getTicketsFromCommits();

      core.info(`Final tickets ${tickets.size}`)
      tickets.forEach(ticket => {
        core.info(`Ticket ${ticket}`)
      });

      if (SLACK_TOKEN && SLACK_CHANNEL) {
        core.debug(`Sending slack message`)
        await sendNewReleaseMessage(RELEASE_NAME)
      }

      if (version === undefined) {
        core.info(`Version ${RELEASE_NAME} not found`)
      } else {
        core.info(`Version ${RELEASE_NAME} found`)
      }
      return;
    }

    const tickets = await getTicketsFromCommits();

    const project = await Project.create(EMAIL, API_TOKEN, PROJECT, SUBDOMAIN)

    core.debug(`Project loaded ${project.project?.id}`)

    const versionName = `${RELEASE_PREFIX} - ${RELEASE_NAME}`
    let version = project.getVersion(versionName)
    if (version === undefined) {
      core.debug(`Version ${versionName} not found`)
      core.debug(`Version ${versionName} is going to the created`)
      const versionToCreate: Version = {
        name: versionName,
        archived: false,
        released: false,
        releaseDate: new Date().toISOString(),
        projectId: Number(project.project?.id)
      }
      version = await project.createVersion(versionToCreate)
      core.debug(versionToCreate.name)
    } else {
      core.debug(`Version ${versionName} found and is going to be updated`)
      const versionToUpdate: Version = {
        ...version,
        self: undefined,
        released: false,
        releaseDate: new Date().toISOString(),
        userReleaseDate: undefined
      }
      version = await project.updateVersion(versionToUpdate)
    }

    if (tickets.size > 0) {
      tickets.forEach(ticket => {
        core.debug(`Going to update ticket ${ticket} with version ${versionName}`)
        if (version?.id !== undefined) project.updateIssue(ticket, versionName)
      })
    }

    if (SLACK_TOKEN && SLACK_CHANNEL) {
      core.debug(`Sending slack message`)
      await sendNewReleaseMessage(RELEASE_NAME)
    }
  } catch (error: Error | unknown) {
    const e: Error = error as Error
    core.setFailed(e)
  }
}

run()
