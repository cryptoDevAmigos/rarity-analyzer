import React from 'react';
import './CssReset.css';
import './App.css';
import { NftCard } from './components/nft-card';
import { nftTestMetadata } from './components/nft-test-metadata';
import { NftLoader } from './components/nft-loader';
import { NftList, NftListLoader } from './components/nft-list';

function App() {

  const route = window.location.pathname.split('/');
  const projectName = route[1] ?? undefined;
  const tokenId = route[2] ?? undefined;

  console.log('route', {route, projectName, tokenId});

  if(projectName && tokenId){
    return (
      <div className="App">
        <NftLoader nftUrl={`/data/${projectName}/${tokenId}.json`}/>
      </div>
    );
  }

  if(projectName){
    return (
      <div className="App">
        <NftListLoader nftListUrl={`/data/${projectName}/collection-rarities.json`}/>
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
