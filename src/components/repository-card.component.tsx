import React from 'react';
import styles from './repository.module.css';
import { RepositoryCardProps } from '../interfaces/repository-interfaces';

function RepositoryCard(props: RepositoryCardProps) {
    const date = new Date (props.repository.date);
    return (
        <div className={styles['repository-card']} onClick={props.onClickSeen}>
            <h3>{props.repository.name}</h3>
            <p>{date.toLocaleDateString()}</p>
            <button onClick={props.onClickDelete}>X</button>
        </div>
    );
}

export default RepositoryCard;
