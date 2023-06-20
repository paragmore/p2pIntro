import Hypercore from "hypercore";
import Autobase from "autobase";
import ram from "random-access-memory";
import Corestore from "corestore";

// Create two chat users, each with their own Hypercores.
// Here since we'll be rerunning the same code a lot, we'll use the ram storage

const store = new Corestore(ram);

const userA = store.get({ name: "userA" });
const userB = store.get({ name: "userB" });

const baseA = new Autobase({ inputs: [userA, userB], localInput: userA });
const baseB = new Autobase({ inputs: [userA, userB], localInput: userB });

await baseA.append("A0: hello!", []);
await baseB.append("B0: hi! good to hear from you", []);
await baseA.append("A1: likewise. fun exercise huh?", []);
await baseB.append("B1: yep. great time.", []);
await baseA.append("A2: likewise. fun exercise huh?", []);
await baseB.append("B2: yep. great time.", []);
await baseA.append("A3: likewise. fun exercise huh?", []);
await baseB.append("B3: yep. great time.", []);
await baseA.append("A4: likewise. fun exercise huh?", []);
await baseB.append("B4: yep. great time.", []);
await baseB.append("B5: yep. great time.", []);

await baseB.append("B6: yep. great time.", []);

// note that this append links the clocks of the previous ones
await baseB.append("B7: looks like we're both online!");
await baseA.append("A5: oops. gone again", []);
await baseB.append("B8: hello?", []);

// Let's print all messages in causal order
for await (const node of baseA.createCausalStream()) {
  console.log("A", node.value.toString(), node.clock);
}

for await (const node of baseB.createCausalStream()) {
  console.log("B", node.value.toString(), node.clock);
}
