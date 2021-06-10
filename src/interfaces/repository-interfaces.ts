export interface Repository {
    name: string,
    date: string,
    seen: boolean,
}

export interface RepositoryCardProps {
    repository: Repository,
    onClickSeen: () => void,
    onClickDelete: () => void,
}
