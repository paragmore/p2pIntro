import Hypercore from "hypercore";
import Autobase from "autobase";
import ram from "random-access-memory";
import Corestore from "corestore";

// Create two chat users, each with their own Hypercores.
// Here since we'll be rerunning the same code a lot, we'll use the ram storage

const store = new Corestore(ram);
const userA = store.get({ name: "userA" });
const userB = store.get({ name: "userB" });
const viewCore = store.get({ name: "view-core" });
// Make an Autobase with those two users as inputs.

const baseA = new Autobase({
  inputs: [userA, userB],
  outputs: [viewCore],
  localInput: userA,
  autostart: true,
});
const baseB = new Autobase({
  inputs: [userA, userB],
  localInput: userB,
  autostart: true,
});

const baseC = new Autobase({
  inputs: [userA, userB],
  outputs: [viewCore],
  autocommit: false,
  autostart: true,
});

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
await baseB.append("B7: looks like we're both online!", []);
await baseA.append("A5: oops. gone again", []);
await baseB.append("B8: hello?", []);
await baseB.append("B9: Okay hello?", []);

baseA.addOutput(viewCore);
const readerView = baseC.view;
await readerView.update();
console.log("baseC.view.status", baseC.view.status);
// const view = ;
// console.log(baseA.view);
if (baseA?.view) {
  console.log("here");
  await baseA.view.update();
  console.log("kk", baseA.view.length, baseA.view.status);

  for (let i = 0; i < baseA.view.length; i++) {
    const node = await baseA.view.get(i);
    console.log("Value", node.value.toString());
  }
}

// The block at index 0 is a header block, so we skip over that.
