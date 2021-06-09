import { Octokit } from "@octokit/core";
import React from 'react';
import RepositoryPage from './components/repository-page.component';
import './App.css';

const octokit = new Octokit();

octokit.request('GET /repos/{owner}/{repo}/releases', {
  owner: 'microsoft',
  repo: 'vscode',
  per_page: 1
}).then(
  (response) => {
    console.log(response);
  }
);

function App() {

  return (
    <RepositoryPage />
  );
}

export default App;
