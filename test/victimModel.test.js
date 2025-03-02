const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;
const Victim = require('../models/victim'); // Update the path as necessary
const faker = require('@faker-js/faker');

describe('Victim Model Test', () => {
    before((done) => {
        mongoose.connect('mongodb://localhost/testDatabase');
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function() {
            console.log('We are connected to test database!');
            done();
        });
    });

    it('should create a new victim record', (done) => {
        const victimData = {
            location: {
                latitude: faker.address.latitude(),
                longitude: faker.address.longitude(),
                city: faker.address.city(),
                state: faker.address.state()
            },
            victimDetails: {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                age: faker.datatype.number({ min: 1, max: 100 }),
                gender: "Male"
            },
            // Add more fields as needed
        };

        const victim = new Victim(victimData);
        victim.save((err, saved) => {
            expect(err).to.be.null;
            expect(saved.location.city).to.equal(victimData.location.city);
            done();
        });
    });

    after((done) => {
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(done);
        });
    });
});
