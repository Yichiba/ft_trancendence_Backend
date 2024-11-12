const CONTRACT_ABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "winner",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "loser",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "winnerScore",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "loserScore",
                "type": "uint256"
            }
        ],
        "name": "MatchRecorded",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_winner",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_loser",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_winnerScore",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_loserScore",
                "type": "uint256"
            }
        ],
        "name": "recordMatch",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getMatchCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getMatches",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "winner",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "loser",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "winnerScore",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "loserScore",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct PongTournament.Match[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "matches",
        "outputs": [
            {
                "internalType": "string",
                "name": "winner",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "loser",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "winnerScore",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "loserScore",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
const CONTRACT_ADDRESS = '0xf646d843f0ad03912ab4f79332d4206e8b8ab6f9';

let web3;
let contract;
async function connectMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        } catch (error) {
            console.error("User denied account access:", error);
        }
    } else {
       console.log("metamask not detected");
    }
}

async function recordMatch(winner , winnerScore, loser , loserScore) {
    
    
    const accounts = await web3.eth.getAccounts();
    
    try {
        await contract.methods.recordMatch(
            winner,
            loser,
            parseInt(winnerScore),
            parseInt(loserScore)
        ).send({ from: accounts[0] });
    } catch (error) {
        console.error("Error recording match:", error);
    }
}
/*

 const winner =
            this.scores[0] >= this.pointsToWin
              ? this.players[0 + this.matchIndex]
              : this.players[1 + this.matchIndex];
          const loser = this.scores[0] >= this.pointsToWin
              ? this.players[1 + this.matchIndex]
              : this.players[0 + this.matchIndex];
          const loserScore =  this.scores[0] >= this.pointsToWin ? this.scores[1] : this.scores[0]; 
          console.log(winner , this.pointsToWin , loser , loserScore);
          recordMatch(winner,this.pointsToWin ,loser , loserScore);
*/
/*
window.addEventListener('load', connectMetaMask);
*/ 