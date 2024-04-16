import {getOctokit} from '@actions/github'
import {
  GH_REPOSITORY,
  GH_USER,
  GH_TOKEN,
} from './env'

export const getTicketsFromCommits = async () => {

  const github = getOctokit(GH_TOKEN)
  const tags = await github.rest.repos.listTags({owner: GH_USER, repo: GH_REPOSITORY})
  const uniqueTickets = new Set<string>()

  await github.rest.repos.compareCommits({owner: GH_USER, repo: GH_REPOSITORY, base: tags.data[1].commit.sha, head: tags.data[0].commit.sha}).then(compare => {
    const JIRA_REGEX = /(?<!([A-Z]{1,10})-?)[A-Z]+-\d+/

    compare.data.commits.forEach((commit) => {
      const matches = commit.commit.message.match(JIRA_REGEX)

      matches?.forEach((match) => {
        if (match !== undefined) uniqueTickets.add(match)
      })
    })
  })

  return uniqueTickets;
}
