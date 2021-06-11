import React from 'react';
import styles from './repository.module.css';
import { RepositoryCardProps } from '../models/repository';

function RepositoryCard(props: RepositoryCardProps) {
    const repository = props.repository;
    const date = new Date (repository.date);
    return (
        <div className={styles['repository-card']}>
            {repository.seen? '' : <button className={styles['repository-card__new-badge']} onClick={props.onClickSeen}>New!</button>}
            <button className={styles['repository-card__delete-button']} onClick={props.onClickDelete}>X</button>
            <h3>
                <a href={`https://github.com/${repository.name}`} target="_blank" rel="noopener noreferrer">
                    {repository.name}
                </a>
            </h3>
            
            <a href={repository.htmlURL} target="_blank" rel="noopener noreferrer">
                {`${repository.tagName} ${repository.releaseName ? `(${repository.releaseName})` : ''}`}
            </a>
            
            <p>
                {repository.date ? date.toLocaleDateString() : 'No releases available'}
            </p>
        </div>
    );
}

export default RepositoryCard;
