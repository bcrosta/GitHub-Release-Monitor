export class Repository {
    constructor(
        public name = '',
        public releaseName = '',
        public tagName = '',
        public date = '',
        public htmlURL = '',
        public seen = false,
    ) {
    }

    static fromResponse(name:string, response: OctokitResponse): Repository {
        return new Repository(
            name,
            response?.name,
            response?.tag_name,
            response?.created_at,
            response?.html_url,
        );
    }
}

export interface RepositoryCardProps {
    repository: Repository,
    onClickSeen: () => void,
    onClickDelete: () => void,
}

export interface RepositorySearchProps {
    search: string,
    onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onClickHandler: () => void,
}

export interface OctokitResponse {
    name: string,
    tag_name: string,
    created_at: string,
    html_url: string,
}
