import React, { useEffect, useState } from 'react';
import RepositoryCard from './repository-card.component';
import RepositorySearch from './repository-search.component';
import RepositoryTracker from '../api/repository-tracker.service';
import { Octokit } from "@octokit/core";
import styles from './repository.module.css';
import { Repository } from '../interfaces/repository-interfaces';

function RepositoryPage() {
    const [search, setSearch] = useState('');
    const [repositories, setRepositories] = useState(new Map());
    const [headerMessage, setHeaderMessage] = useState('');

    useEffect(() => {
        const storedRepositoriesString = localStorage.getItem('repositories');
        if (storedRepositoriesString) {
            const storedRepositoriesObject = JSON.parse(storedRepositoriesString);
            const newRepositories = new Map();
            Object.keys(storedRepositoriesObject).forEach((repositoryName: string) => {
                fetchRepository(repositoryName).then((repository: Repository) => {
                    newRepositories.set(repositoryName, repository);
                }).catch(rejectionMessage => setHeaderMessage(rejectionMessage));
            });
            setRepositories(newRepositories);
        }
    }, []);

    useEffect(() => {
        const repositoriesObject = Object.fromEntries(repositories);
        if (Object.keys(repositoriesObject).length !== 0) {
            localStorage.setItem('repositories', JSON.stringify(repositoriesObject));
        }
    }, [repositories]);

    const onSearchChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    }

    const onSearchClickHandler = () => {
        fetchRepository(search).then((repository: Repository) => {
            let newRepositories = new Map(repositories);
            newRepositories.set(search, repository);
            setRepositories(newRepositories);
        }).catch(rejectionMessage => setHeaderMessage(rejectionMessage));
    }

    const fetchRepository = async (request: string): Promise<Repository> => {
        request = request.toLowerCase();
        if (repositories.has(request)) return Promise.reject(`Repository ${request} already tracked`);

        const octokit = new Octokit();
        const [owner, repo] = request.split('/');

        if (owner && repo) {
            try {
                const response = await octokit.request('GET /repos/{owner}/{repo}/releases', {
                    owner: owner,
                    repo: repo,
                    per_page: 1
                });
                console.log(response);
                const createdAt = response?.data?.[0]?.created_at;
            
                const newRepository: Repository = {
                    name: request, 
                    date: createdAt, 
                    seen: false
                };
                setHeaderMessage(`Tracking repository ${request}`)
                return newRepository;
            } catch(error) {
            } 
        }
        return Promise.reject(`Repository ${request} not found`);
    }

    const onClickDeleteHandler = (repositoryName: string) => {
        console.log("delete " + repositoryName);
        const newRepositories = new Map(repositories);
        newRepositories.delete(repositoryName);
        setRepositories(newRepositories);
    }

    const onClickSeenHandler = (repositoryName: string) => {
        const repository: Repository = repositories.get(repositoryName);
        if (repository) repository.seen = true;
    }

    return (
        <div className={styles['repository-page']}>
            <div className={styles['repository-headers']}>
                <h1>Github Release Monitor</h1>
                <h4>Add a repository using format owner/repository</h4>
                <h5>{headerMessage}</h5>
            </div>
            <RepositorySearch 
                search={search} 
                onChangeHandler={onSearchChangeHandler}
                onClickHandler={onSearchClickHandler}
            />
            <div className={styles['repository-list']}>
                {repositories.size ? Array.from(repositories.values()).map((repository: Repository) => {
                    return (
                        <RepositoryCard 
                            repository={repository}
                            key={repository.name}
                            onClickSeen={() => onClickSeenHandler(repository.name)}
                            onClickDelete={() => onClickDeleteHandler(repository.name)}
                        />
                    )
                }) : ''}
            </div>
            
        </div>
    );
}

export default RepositoryPage;
