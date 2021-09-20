import React from 'react';
import './CssReset.css';
import './App.css';
import { NftLoader } from './components/nft-loader';
import { NftProjectLoader } from './components/nft-project';

function App() {

  const route = window.location.pathname.split('/');
  const projectKey = route[1] ?? undefined;
  const tokenId = route[2] ?? undefined;

  console.log('route', {route, projectKey, tokenId});

  if(projectKey && tokenId){
    return (
      <div className="App">
        <NftLoader projectKey={projectKey} tokenId={tokenId}/>
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
          TODO: Projects List
    </div>
  );
}

export default App;
