import React from 'react';
import logo from './logo.svg';
import './CssReset.css';
import './App.css';
import { NftCard } from './components/nft-card';
import { nftTestMetadata } from './components/nft-test-metadata';

function App() {
  return (
    <div className="App">
        <p>
          <NftCard nft={nftTestMetadata}/>
        </p>
    </div>
  );
}

export default App;
