import Corestore from "corestore";
import Hyperswarm from "hyperswarm";

const store = new Corestore("./peer-store");
const swarm = new Hyperswarm();

// Setup corestore replication
swarm.on("connection", (connection) => store.replicate(connection));

// Load a core by public key
const core = store.get(Buffer.from(process.argv[2], "hex"));

await core.ready();

// Join the Hypercore discoveryKey (a hash of it's public key)
swarm.join(core.discoveryKey);

// Make sure we have all the connections
await swarm.flush();

// Make sure we have the latest length
await core.update();

// Print the length (should print 10000)
console.log("Core length is:", core.length);

const block = await core.get(1453);
console.log("Block 1453", block);
