'use strict';
const { setupDatabase } = require('./shared');
const { expect } = require('chai');
const { MongoClient } = require('../../src');

describe('MongoClient Options', function () {
  before(function () {
    return setupDatabase(this.configuration);
  });

  it('should error on unexpected options', {
    metadata: { requires: { topology: 'single' } },

    test: function () {
      expect(
        () =>
          new MongoClient(this.configuration.url(), {
            maxPoolSize: 4,
            notLegal: {}
          })
      ).to.throw('Unsupported option notlegal');
    }
  });
});
