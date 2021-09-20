import React from 'react';
import logo from './logo.svg';
import './CssReset.css';
import './App.css';
import { NftCard } from './components/nft-card';
import { nftTestMetadata } from './components/nft-test-metadata';
import { NftLoader } from './components/nft-loader';

function App() {

  const route = window.location.pathname.split('/');
  const projectName = route[1] ?? undefined;
  const tokenId = route[2] ?? undefined;

  console.log('route', {route, projectName, tokenId});

  if(projectName && tokenId){
    return (
      <div className="App">
          <p>
            <NftLoader nftUrl={`/data/${projectName}/${tokenId}.json`}/>
          </p>
      </div>
    );
  }

  return (
    <div className="App">
        <p>
          Empty 2
        </p>
    </div>
  );
}

export default App;
