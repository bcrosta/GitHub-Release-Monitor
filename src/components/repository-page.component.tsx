import React, { useEffect, useState } from 'react';
import RepositoryCard from './repository-card.component';
import RepositorySearch from './repository-search.component';
import { Octokit } from "@octokit/core";
import { Repository, OctokitResponse } from '../models/repository';
import styles from './repository.module.css';


function RepositoryPage() {
    const [search, setSearch] = useState('');
    const [repositories, setRepositories] = useState(new Array());
    const [headerMessage, setHeaderMessage] = useState('Not tracking any repositories yet');

    useEffect(() => {
        refreshStoredRepositories();
    }, []);

    useEffect(() => {
        if (repositories.length > 0) {
            storeRepositories(repositories);
        }
    }, [repositories]);

    const onSearchChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    }

    const onSearchClickHandler = () => {
        fetchRepository(search).then((repository: Repository) => {
            setRepositories([...repositories, repository]);
        }).catch(rejectionMessage => setHeaderMessage(rejectionMessage));
    }

    const storeRepositories = (storedRepositories: Repository[]) => {
        localStorage.setItem('repositories', JSON.stringify(storedRepositories));
    }

    const getStoredRepositories = (): Repository[] => {
        const storedRepositoriesString = localStorage.getItem('repositories');
        if (storedRepositoriesString && storedRepositoriesString !== '[]') {
            return JSON.parse(storedRepositoriesString);
        }
        return [];
    }

    const refreshStoredRepositories = async () => {
        const storedRepositories = getStoredRepositories() as any;
        if (storedRepositories.length > 0) {
            Promise.allSettled<Repository>(storedRepositories.map((repository: Repository) => {
                return fetchRepository(repository.name);
            })).then((results: PromiseSettledResult<Repository>[]) => {
                const fulfilledFetchesValues = results.map(result => {
                    if (result.status === 'fulfilled') {
                        return result.value as Repository;
                    }
                    return null;
                });
                const fetchedRepositories = fulfilledFetchesValues.map((fetchedRepository: Repository | null, index) => {
                    if (fetchedRepository) {
                        const storedRepository = storedRepositories[index];
                        const sameRelease = fetchedRepository.tagName === storedRepository.tagName;

                        if (sameRelease) fetchedRepository.seen = storedRepository.seen;
                        if (!sameRelease || (storedRepository.seen === false)) fetchedRepository.seen = false;
                    }

                    return fetchedRepository;
                }).filter(repository => repository !== null);
                
                setRepositories(fetchedRepositories);
                setHeaderMessage('Refreshed saved repositories');
            })
        }
        
        return [];
    }

    const fetchRepository = async (request: string): Promise<Repository> => {
        request = request.toLowerCase().replace(/\s/g, '');
        if (repositories.find(repository => repository.name === request)){
            return Promise.reject(`Repository ${request} already tracked`);
        }
        const [owner, repo] = request.split('/');

        if (owner && repo) {
            try {
                const response = await new Octokit().request('GET /repos/{owner}/{repo}/releases', {
                    owner: owner,
                    repo: repo,
                    per_page: 1
                });
                const newRepository = Repository.fromResponse(request, response.data[0] as OctokitResponse);
                setHeaderMessage(`Tracking repository ${request}`)
                return newRepository;
            } catch (error) {
            } 
        }
        return Promise.reject(`Repository ${request} not found`);
    }

    const onClickDeleteHandler = (repositoryName: string) => {
        const newRepositories = repositories.filter((repository: Repository) => repository.name !== repositoryName);
        if (newRepositories.length === 0) storeRepositories([]);
        setRepositories(newRepositories);
        setHeaderMessage(`Removed repository ${repositoryName}`)
    }

    const onClickSeenHandler = (repositoryName: string) => {
        const seenRepositoryIndex = repositories.findIndex(repository => repository.name === repositoryName);
        const seenRepository: Repository = repositories[seenRepositoryIndex];
        seenRepository.seen = true;

        const newRepositories = [...repositories];
        newRepositories[seenRepositoryIndex] = seenRepository;
        setRepositories(newRepositories);
        setHeaderMessage(`Repository ${repositoryName} marked as seen`)
    }

    return (
        <div className={styles['repository-page']}>
            <div className={styles['repository-headers']}>
                <h1>GitHub Release Monitor</h1>
                <h3>Repository Dashboard</h3>
                <h4>{'Try some '}
                    <a href="https://github.com/trending" target="_blank" rel="noopener noreferrer">trending</a> repositories!
                </h4>
                <h5>{headerMessage}</h5>
            </div>
            <RepositorySearch 
                search={search} 
                onChangeHandler={onSearchChangeHandler}
                onClickHandler={onSearchClickHandler}
            />
            <div className={styles['repository-list']}>
                {repositories.map((repository: Repository) => {
                    return (
                        <RepositoryCard 
                            repository={repository}
                            key={repository.name}
                            onClickSeen={() => onClickSeenHandler(repository.name)}
                            onClickDelete={() => onClickDeleteHandler(repository.name)}
                        />
                    )
                })}
            </div>  
        </div>
    );
}

export default RepositoryPage;
