import React from 'react';
import styles from './repository.module.css';
import { RepositorySearchProps } from '../models/repository';

function RepositorySearch(props: RepositorySearchProps) {
    const onKeyDownHandler = (event: any) => {
        if (event.key === 'Enter') {
            props.onClickHandler();
        }
    }

    return (
        <div>
            <input 
                className={styles['repository-search__text-input']} 
                type="text" 
                onChange={props.onChangeHandler}
                onKeyDown={onKeyDownHandler} 
                placeholder="Use format owner/repository, e.g. apple/swift"
            />
            <button 
                className={styles['repository-search__add-button']}
                onClick={props.onClickHandler}
            >
                add
            </button>
        </div>
    );
}

export default RepositorySearch;
