// super simple script to poll the just.game contract for current timer value and execute a box buy if under a certain threshold
// you will need node to run this, and a scheduler, such as cron, or an improved version of this script :)

const TronWeb = require('tronweb');

// This provider is optional, you can just use a url for the nodes instead
const HttpProvider = TronWeb.providers.HttpProvider;

const fullNode = 'https://api.trongrid.io';
const solidityNode = 'https://api.trongrid.io';
const eventServer = 'https://api.trongrid.io';
const privateKey = 'YOUR_PRIVATE_KEY_HERE';

const tronWeb = new TronWeb(
  fullNode,
  solidityNode,
  eventServer,
  privateKey
);

// the just.game contract
const game_contract = "TWjkoz18Y48SgWoxEeGG11ezCCzee8wo1A";

// my referral, if you wish to thank me leave this here, if not, change it
const referrer = "0x7072697a00000000000000000000000000000000000000000000000000000000";

async function check_timer (){
  try {
    let contract = await tronWeb.contract().at(game_contract);
    let currentValue = await contract.currentRoundData().call();
    const endsAt = currentValue.endsAt.toString();
    const date = new Date();
    now = parseInt(date.getTime() / 1000);
    // set our acceptable endtime as 11 hours and 5 minutes in seconds in the future
    const acceptable = now + 39900;
    if (endsAt < acceptable) {
      console.log("buy a box");
      //buy a box
      transact();
    } else {
      console.log("don't buy a box");
    }
  }
  catch(err) {
    console.log(err);
  }
}

async function transact() {
  try {
    let contract = await tronWeb.contract().at(game_contract);
    let result = await contract.buyTickets(referrer).send({
    feeLimit:200000000,
    callValue:25000000,
    shouldPollResponse:false
    });
    console.log("tx result: " + result);	
  }
  catch(err) {
    console.log(err);
  }
} 

check_timer();
