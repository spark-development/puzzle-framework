"use strict";

const expect = require("chai").expect;

const AuthenticatedUser = require("../../src/utils/AuthenticatedUser");
const PObject = require("@puzzleframework/lite/src/core/PObject");

class User extends PObject {}

describe("AuthenticatedUser class check", () => {
  it("className should be User", () => {
    const user = new User();
    expect(user.className).to.be.a("string");
    expect(user.className).to.equal("User");
  });
  it("null should fail", () => {
    expect(AuthenticatedUser(null)).to.be.false;
  });
  it("empty parameter should fail", () => {
    expect(AuthenticatedUser()).to.be.false;
  });
  it("Other object that isn't user parameter should fail", () => {
    expect(AuthenticatedUser({})).to.be.false;
  });
  it("User should pass", () => {
    const user = new User();
    expect(AuthenticatedUser(user)).to.be.true;
  });
});
