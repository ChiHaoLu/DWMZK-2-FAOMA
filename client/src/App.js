import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

function App() {
    const [ownerAddress, setOwnerAddress] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [verifierAddress, setVerifierAddress] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [proof, setProof] = useState('');

    const [resultOne, setResultOne] = useState(''); 
    const [resultTwo, setResultTwo] = useState(''); 
    const [resultThree, setResultThree] = useState(''); 

    //mint wallet, tokenid, verifier address
    const handleMint = () => {


    };

    const handleSearch = () => {

    }

    const handleTransfer = () => {
      //from to id proof

    }

    return (
        <div className="App">
          <h1>Demo Page</h1>
          <br />
            <div>
                <h2>Mint Page</h2>
                <form onSubmit={handleMint}>
                    <label>
                        Your wallet
                        <input type="text" value={ownerAddress} onChange={(e) => setOwnerAddress(e.target.value)} />
                    </label>
                    <br />
                    <label>
                        TokenId
                        <input type="text" value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
                    </label>
                    <br />
                    <label>
                        Verifier Address
                        <input type="text" value={verifierAddress} onChange={(e) => setVerifierAddress(e.target.value)} />
                    </label>
                    <br />
                    <button type="submit">Mint</button>
                </form>
                <br />
                <p>{resultOne}</p>
            </div>

            <div>
                <h2>Search Page</h2>
                <form onSubmit={handleSearch}>
                    <label>
                        TokenId
                        <input type="text" value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
                    </label>
                    <br />
                    <button type="submit">Search Owner</button>
                </form>
                <br />
                <p>{resultOne}</p>
            </div>

            <div>
                <h2>Transfer Page</h2>
                <form onSubmit={handleTransfer}>
                    <label>
                        From
                        <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} />
                    </label>
                    <br />
                    <label>
                        To
                        <input type="text" value={to} onChange={(e) => setTo(e.target.value)} />
                    </label>
                    <br />
                    <label>
                        Proof
                        <input type="text" value={proof} onChange={(e) => setProof(e.target.value)} />
                    </label>
                    <br />
                    <label>
                        TokenId
                        <input type="text" value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
                    </label>
                    <br />
                    <button type="submit">Tranfer</button>
                </form>
                <br />
                <p>{resultThree}</p>
            </div>
        </div>
    );
}

export default App;
