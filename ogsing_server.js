import cors from "cors";
import express from "express";
import { ethers } from "ethers";
import keccak256 from "keccak256";
import fs from "fs";
const app = express();

const readRawList = (path) => {
    const rawdata = fs.readFileSync(path);
    const data = JSON.parse(rawdata);

    return data;
};

let og_whitelist = readRawList('./db/og_shitelist.json');

let whitelist = readRawList('./db/whitelist.json');

async function get_og_signature(wallettest){
	
	var found = og_whitelist.find(element => element.toLowerCase() == wallettest.toLowerCase());
	
	if(found !== undefined){
		
		var w = new ethers.Wallet(process.env.OGPRIVATE); //OG privkey
		//console.log('Signer wallet',w.address);
		let messageHash = ethers.utils.solidityKeccak256(['address'], [found]);
		let signature = await w.signMessage(ethers.utils.arrayify(messageHash));
		return signature;
		
	}
	return false;
}

async function get_signature(wallettest){
	
	var found = whitelist.find(element => element.toLowerCase() == wallettest.toLowerCase());
	
	if(found !== undefined){
		
		var w = new ethers.Wallet(process.env.WLPRIVATE); //privkey
		//console.log('Signer wallet',w.address);
		let messageHash = ethers.utils.solidityKeccak256(['address'], [found]);
		let signature = await w.signMessage(ethers.utils.arrayify(messageHash));
		return signature;
		
	}
	return false;
}

app.set("port", process.env.PORT || 5000)
  .use(cors())
  .use(express.json());
  
app.get("/", async (req, res, next) => {  
res.send('ok');
});

app.get("/ogsing", async (req, res, next) => {
	try {
		//console.log(req.query.wallet);
		var signnn = await get_og_signature(req.query.wallet);
		if(signnn){
			res.json({status:'sucess',signature:signnn});
		}else {
			res.json({status:'notfound'});
		}
 
 } catch (error) {
    // Passes errors into the error handler
    return next(error)
  }
});

app.get("/sing", async (req, res, next) => {
	try {
		//console.log(req.query.wallet);
		var signnn = await get_signature(req.query.wallet);
		if(signnn){
			res.json({status:'sucess',signature:signnn});
		}else {
			res.json({status:'notfound'});
		}
 
 } catch (error) {
    // Passes errors into the error handler
    return next(error)
  }
});

app.listen(app.get("port"), () =>
    console.log(`server listening on port ${app.get("port")}`)
  );