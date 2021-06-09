import React, { useEffect, useState } from 'react';
import RepositoryCard from './repository-card.component';
import RepositorySearch from './repository-search.component';
import RepositoryTracker from '../api/repository-tracker.service';
import { Octokit } from "@octokit/core";
import styles from './repository.module.css';

function RepositoryPage() {
    const [search, setSearch] = useState('');
    const [repositories, setRepositories] = useState(Array());

    useEffect(() => {
        let storedRepositories = localStorage.getItem('repositories');
        if (storedRepositories) {
            setRepositories(JSON.parse(storedRepositories));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('repositories', JSON.stringify(repositories));
    }, [repositories]);

    const onSearchChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    }

    const onSearchClickHandler = () => {
        fetchRepository(search);
    }

    const fetchRepository = (request: string) => {
        const octokit = new Octokit();
        const [owner, repo] = search.split('/');

        if (owner && repo) {
            octokit.request('GET /repos/{owner}/{repo}/releases', {
                owner: owner,
                repo: repo,
                per_page: 1
            }).then((response) => {
                  console.log(response);
                  let releaseDate = response?.data?.[0]?.created_at || '';
                  if (releaseDate !== '') releaseDate = (new Date(releaseDate)).toDateString();
                  const newRepository = {name: search, date: releaseDate, seen: false};
                  setRepositories([...repositories, newRepository]);
                }
            );
        }
    }

    const onClickDeleteHandler = () => {
        return null;
    }

    return (
        <div className={styles['repository-page']}>
            <RepositorySearch 
                search={search} 
                onChangeHandler={onSearchChangeHandler}
                onClickHandler={onSearchClickHandler}
            />
            <div className={styles['repository-list']}>
                {repositories.map((repository, index) => {
                    return (
                        <RepositoryCard 
                            name={repository.name} 
                            date={repository.date}
                            key={index}
                            onClickDelete={onClickDeleteHandler}
                        />
                    )
                })}
            </div>
            
        </div>
    );
}

export default RepositoryPage;
