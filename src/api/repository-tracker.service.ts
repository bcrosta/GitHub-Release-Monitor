import { Octokit } from "@octokit/core";

class RepositoryTracker {
    private octokit: Octokit;

    constructor () {
        this.octokit = new Octokit();
    }

    public static getRepository (repositoryName: string) {
         
    }

    public static fetchRepositories (repositoryName: string) {
         
    }
}

export default RepositoryTracker;
