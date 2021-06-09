import React from 'react';
import styles from './repository.module.css';

function RepositorySearch(props: any) {
    return (
        <div>
            <input className={styles['repository-text-input']} type="text" onChange={props.onChangeHandler} />
            <button onClick={props.onClickHandler}>add</button>
        </div>
    );
}

export default RepositorySearch;
