import test from "node:test";
import assert from "node:assert/strict";
import {
  monthlyShare, coShare, bandForAge, SHARING_CAP, CO_SHARE_CAP, CO_SHARE_RATES,
} from "./weshare-math.ts";

test("monthly share divides the month's bills across active members", () => {
  const r = monthlyShare(100_000, 8_000);
  assert.equal(r.rawShare, 12.5);
  assert.equal(r.perMember, 12.5);
  assert.equal(r.capped, false);
  assert.equal(r.carriedPerMember, 0);
});

test("monthly share is held at the RM60 cap", () => {
  const r = monthlyShare(800_000, 8_000);
  assert.equal(r.rawShare, 100);
  assert.equal(r.perMember, SHARING_CAP);
  assert.equal(r.capped, true);
});

test("the amount the cap holds back is carried forward, per member and in total", () => {
  const r = monthlyShare(800_000, 8_000);
  assert.equal(r.carriedPerMember, 40);
  assert.equal(r.carriedTotal, 320_000);
  // What members share plus what is carried equals the month's bills.
  assert.equal(r.perMember * 8_000 + r.carriedTotal, 800_000);
});

test("a month with no approved bills costs nothing", () => {
  const r = monthlyShare(0, 8_000);
  assert.equal(r.perMember, 0);
  assert.equal(r.capped, false);
  assert.equal(r.carriedTotal, 0);
});

test("the published October 2026 month reproduces its own figures", () => {
  const r = monthlyShare(380_527.94, 6_274);
  assert.ok(Math.abs(r.rawShare - 60.65) < 0.01, `rawShare was ${r.rawShare}`);
  assert.equal(r.perMember, 60);
  assert.equal(r.capped, true);
});

test("zero or missing members divides by nothing rather than by zero", () => {
  for (const n of [0, -1, Number.NaN]) {
    const r = monthlyShare(100_000, n);
    assert.equal(r.perMember, 0);
    assert.ok(Number.isFinite(r.rawShare));
  }
});

test("co-share rate follows the age band", () => {
  assert.equal(coShare(1_000, "0-5").memberPays, 250);
  assert.equal(coShare(1_000, "6-45").memberPays, 100);
  assert.equal(coShare(1_000, "46+").memberPays, 200);
  assert.deepEqual(CO_SHARE_RATES, { "0-5": 0.25, "6-45": 0.1, "46+": 0.2 });
});

test("co-share is capped at RM500 per admission", () => {
  const r = coShare(50_000, "6-45");
  assert.equal(r.rawCoShare, 5_000);
  assert.equal(r.memberPays, CO_SHARE_CAP);
  assert.equal(r.capped, true);
  assert.equal(r.communityShares, 49_500);
});

test("member and community together always account for the whole bill", () => {
  for (const bill of [0, 800, 2_000, 50_000, 1_000_000]) {
    for (const band of ["0-5", "6-45", "46+"] as const) {
      const r = coShare(bill, band);
      assert.equal(r.memberPays + r.communityShares, bill);
    }
  }
});

test("a government hospital admission carries no co-share", () => {
  const r = coShare(50_000, "46+", true);
  assert.equal(r.memberPays, 0);
  assert.equal(r.communityShares, 50_000);
  assert.equal(r.waived, true);
  assert.equal(r.capped, false);
});

test("bandForAge maps ages onto the three bands, including the boundaries", () => {
  assert.equal(bandForAge(0), "0-5");
  assert.equal(bandForAge(5), "0-5");
  assert.equal(bandForAge(6), "6-45");
  assert.equal(bandForAge(45), "6-45");
  assert.equal(bandForAge(46), "46+");
  assert.equal(bandForAge(90), "46+");
});
