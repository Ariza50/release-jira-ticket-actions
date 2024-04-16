# Jira Release Action

<p align="center">
  <a href="https://github.com/Ariza50/release-jira-ticket-actions"></a>
</p>

This Github action connects your Jira and github repositories to automatically create a release in Jira when a new release is created in Github.

The action also get all the jira issues number from the commit messages and update the 'Fix Version' field of the issues with the new release version.

## Usage

### Input

| Name          | Description                                   | Required           |
|---------------|-----------------------------------------------|--------------------|
| email         | Jira login                                    | Y                  |
| api_token     | Jira api token                                | Y                  |
| subdomain     | Jira cloud instance. '[domain].atlassian.net' | Y                  |
| jira_project  | Key of the jira project                       | Y                  |
| release_name  | Name of the release                           | Y                  |
| gh_user       | Github user                                   | Y                  |
| gh_token      | Github token                                  | Y                  |
| gh_repository | Github repository                             | Y                  |
| dry_run       | Dump actions that would be taken              | N (default: false) |

### Example

```yaml
jobs:
  test: # make sure the action works on a clean machine without building
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: |
          npm install
      - run: |
          npm run build
      - uses: ./
        with:
          dry_run: false
          email: ${{ secrets[jira_email] }}
          api_token:  ${{ secrets[jira_token] }}
          subdomain: ${{ secrets[jira_domain] }}
          gh_user: githubuser
          gh_token:  ${{ secrets[format('{0}_PAT', github.actor)] }}
          gh_repository: githubrepo
          jira_project: 10000
          release_name: ${{ env.package_version }}
```

## Reference

* [Jira API](https://developer.atlassian.com/server/jira/platform/rest-apis/)
* [Github API](https://docs.github.com/en/rest/using-the-rest-api/getting-started-with-the-rest-api?apiVersion=2022-11-28&tool=javascript)
* [Code inspiration](https://github.com/charpi/jira-release-actions)
