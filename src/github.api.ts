import * as core from '@actions/core'
import * as github from "@actions/github";
import {TICKETS} from './env'
import {context, getOctokit} from '@actions/github'

export const getPRInfo = async () => {

  /*const payload = github.context.payload
  const repository = payload.repository
  if (repository == null) {
    core.setFailed("github.context.payload.repository is null")
    return
  }*/

  const github = getOctokit('')

  //  this is only for test
  const newTag = '1.9.2'


  const rest = await github.rest.repos.listTags({owner: 'ariza50', repo: 'admin-ci'})
  rest.data.forEach(tag => {
    core.info(`tag ${tag.name}`)
  })

  await github.rest.repos.listCommits({owner: 'ariza50', repo: 'admin-ci', sha: rest.data[0].commit.sha}).then(commits => {
    commits.data.forEach(commit => {
      core.info(`commit ${commit.sha}`)
    })
  })
  console.log('-> rest.data[0]', rest.data[0])

  /*const release = await github.rest.repos.createRelease({
    owner: 'ariza50',
    repo: 'admin-ci',
    tag_name: newTag,
    name: `v${newTag}`,
    generate_release_notes: true,
    draft: false,
    prerelease: false,
    make_latest: 'true'
  })

  core.info(`release ${release.data.tag_name}`)
  core.info(`release ${release.data.name}`)
  core.info(`release ${release.data.body}`)*/

}

function getJiraVersionName(branchName: string, jiraVersionPrefix?: string): string | null {
  const regex = new RegExp(`/(\\d+\\.\\d+\\.\\d+)`, "g")
  const matches: string[] | null = regex.exec(branchName)
  if (matches == null) {
    return null
  }
  const versionName = matches[1]
  if (jiraVersionPrefix != null) {
    return `${jiraVersionPrefix} ${versionName}`
  } else {
    return versionName
  }
}
