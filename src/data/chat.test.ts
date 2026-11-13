import test from "node:test";
import assert from "node:assert/strict";
import { CHAT_ROOTS, chatNodes, findChatNode, scopeForPath } from "./chat.ts";

/** Every opening question across every scope. */
const allRoots = Object.values(CHAT_ROOTS).flat();

const ids = new Set(chatNodes.map((n) => n.id));

test("every node id is unique", () => {
  assert.equal(ids.size, chatNodes.length);
});

test("every root question, in every scope, is a real node", () => {
  for (const [scope, roots] of Object.entries(CHAT_ROOTS)) {
    assert.ok(roots.length > 0, `scope "${scope}" opens on nothing`);
    for (const id of roots) assert.ok(ids.has(id), `${scope} root "${id}" has no node`);
  }
});

test("a plan page opens on its own plan's questions", () => {
  assert.equal(scopeForPath("/plans/weshare"), "weshare");
  assert.equal(scopeForPath("/plans/wecare"), "wecare");
  assert.equal(scopeForPath("/"), "general");
  assert.equal(scopeForPath("/plans"), "general");
  assert.equal(scopeForPath("/stories/a-family-trip-that-took-a-turn"), "general");
});

test("neither plan scope opens on the other plan's answers", () => {
  for (const id of CHAT_ROOTS.weshare) assert.ok(!id.toLowerCase().includes("wecare"), id);
  for (const id of CHAT_ROOTS.wecare) assert.ok(!id.toLowerCase().includes("weshare"), id);
});

test("every follow-up points at a real node", () => {
  for (const node of chatNodes)
    for (const next of node.next)
      assert.ok(ids.has(next), `"${node.id}" offers "${next}", which does not exist`);
});

test("no node offers itself as a follow-up", () => {
  for (const node of chatNodes)
    assert.ok(!node.next.includes(node.id), `"${node.id}" leads back to itself`);
});

test("no node offers the same follow-up twice", () => {
  for (const node of chatNodes)
    assert.equal(new Set(node.next).size, node.next.length, `"${node.id}" repeats a follow-up`);
});

test("three follow-ups at most, and never none", () => {
  for (const node of chatNodes) {
    assert.ok(node.next.length > 0, `"${node.id}" is a dead end`);
    assert.ok(node.next.length <= 3, `"${node.id}" offers ${node.next.length}`);
  }
});

test("every node is reachable from some opening set", () => {
  const seen = new Set<string>();
  const queue = [...allRoots];
  while (queue.length) {
    const id = queue.shift() as string;
    if (seen.has(id)) continue;
    seen.add(id);
    queue.push(...(findChatNode(id)?.next ?? []));
  }
  const stranded = chatNodes.filter((n) => !seen.has(n.id)).map((n) => n.id);
  assert.deepEqual(stranded, [], `unreachable: ${stranded.join(", ")}`);
});
