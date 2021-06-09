import React from 'react';
import styles from './repository.module.css';

function RepositoryCard(props: any) {
    return (
        <div className={styles['repository-card']} onClick={props.onClickSeen}>
            <h3>{props.name}</h3>
            <p>{props.date}</p>
            <button onClick={props.onClickDelete}>X</button>
        </div>
    );
}

export default RepositoryCard;
