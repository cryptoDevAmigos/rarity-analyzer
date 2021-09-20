import React from 'react';
import './CssReset.css';
import './App.css';
import { NftLoader } from './components/nft-loader';
import { NftProjectLoader } from './components/nft-project';
import { NftProjectsLoader } from './components/nft-projects';

function App() {

  const route = window.location.pathname.split('/');
  const projectKey = route[1] ?? undefined;
  const tokenId = route[2] ?? undefined;

  console.log('route', {route, projectKey, tokenId});

  if(projectKey && tokenId){
    return (
      <div className="App">
        <div className='nft-list'>
          <NftLoader projectKey={projectKey} tokenId={tokenId}/>
        </div>
      </div>
    );
  }

  if(projectKey){
    return (
      <div className="App">
        <NftProjectLoader projectKey={projectKey}/>
      </div>
    );
  }

  return (
    <div className="App">
        <NftProjectsLoader/>
    </div>
  );
}

export default App;
