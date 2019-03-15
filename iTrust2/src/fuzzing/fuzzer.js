var expect    = require("chai").expect;
var main = require("../main");

describe("Sanity check", function() {
  describe("mutationTesting runs", function() {
    it("doesn't crash", function() {
        main.mutationTesting([__dirname + '/../main/java/edu/ncsu/csc/itrust2/config/ContextListener.java'],100);
    });
  });

  describe("fuzzer works", function() {
    it("mutate string", function() {
        main.fuzzer.mutate.string("hello");
    });
  });
});