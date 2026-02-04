const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const NFT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address,uint256) returns (bool)"
];

const NFT_ABI = [
  "function ownerOf(uint256) view returns (address)",
  "function tokenURI(uint256) view returns (string)"
];

let provider, signer, account;

const $ = (id) => document.getElementById(id);

function setStatus(msg, isError = false) {
  $("status").className = isError ? "err" : "ok";
  $("status").innerText = msg;
}

async function connect() {
  if (!window.ethereum) {
    setStatus("MetaMask not found", true);
    return;
  }
  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  account = await signer.getAddress();
  const tokenCode = await provider.getCode(TOKEN_ADDRESS);
  console.log("TOKEN code length:", tokenCode.length, tokenCode);

if (tokenCode === "0x") {
  setStatus("No contract at TOKEN_ADDRESS on this network. Check address/network.", true);
  return;
}

  $("account").innerText = account;
  setStatus("Connected");
  await loadToken();
}

async function loadToken() {
  const token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);
  const [name, symbol, decimals, bal] = await Promise.all([
    token.name(),
    token.symbol(),
    token.decimals(),
    token.balanceOf(account)
  ]);

  $("tokenInfo").innerText = `${name} (${symbol}) decimals=${decimals}`;
  $("tokenBalance").innerText = ethers.formatUnits(bal, decimals);
}

async function sendToken() {
  try {
    const token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
    const to = $("to").value.trim();
    const amount = $("amount").value.trim();

    const decimals = await token.decimals();
    const value = ethers.parseUnits(amount, decimals);

    const tx = await token.transfer(to, value);
    $("tokenTx").innerHTML = `<code>${tx.hash}</code>`;
    await tx.wait();

    setStatus("Transfer success");
    await loadToken();
  } catch (e) {
    setStatus(e.message, true);
  }
}

async function loadNFTs() {
  const nft = new ethers.Contract(NFT_ADDRESS, NFT_ABI, provider);
  $("nftAddr").innerHTML = `<code>${NFT_ADDRESS}</code>`;
  $("nftList").innerHTML = "";

  for (const id of [0, 1, 2]) {
    try {
      const owner = await nft.ownerOf(id);
      const uri = await nft.tokenURI(id);
      const li = document.createElement("li");
      li.innerHTML = `tokenId <b>${id}</b> | owner: <code>${owner}</code> | uri: <code>${uri}</code>`;
      $("nftList").appendChild(li);
    } catch {
      const li = document.createElement("li");
      li.innerText = `tokenId ${id} not found`;
      $("nftList").appendChild(li);
    }
  }
}

$("connectBtn").onclick = connect;
$("sendBtn").onclick = sendToken;
$("loadNftsBtn").onclick = loadNFTs;
