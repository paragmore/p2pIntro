import Corestore from "corestore";

const store = new Corestore("./store");

// You can access cores from the store either by their public key or a local name
const core = store.get({ name: "my-first-core" });
await core.ready();

console.log("Core public key:", core.key.toString("hex"));
console.log("Core has", core.length, "entries");
await core.append(Buffer.from("a block"));

const sameCore = store.get(
  Buffer.from(
    "3961a9db15bafb110fdde9b9ce67c97881e609a74262dfc2087a10c98853a65f"
  )
);

// const data = await sameCore.get(1);
// console.log(data);
