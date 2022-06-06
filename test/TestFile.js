const chai = require('chai');
const request = require('supertest');
const assert = chai.assert;
const path = require("path");
require('mocha-sinon');

const app = require('../index');
const { job } = require('../src/middlewares/cronJob');

var UploadFile = require("../src/models/uploadFile");
var expect = require('chai').expect;

describe('Test about MODEL functions', () => {
    describe('Unit Test for file to be showed', () => {
        it('Test for the existance of the file in DB', () => {
            var myTestFile = UploadFile.findFileToBeShowed("0137c9b2e0415202");;
            assert.isNotNull(myTestFile, 'great, time for tea!');

        });
        it('Test for the type of the file in DB', () => {
            var myTestFile = UploadFile.findFileToBeShowed("0137c9b2e0415202");;
            assert.isNotObject(myTestFile, 'not an object');

        });
    });
    describe('Unit Test for file to be deleted', () => {
        it('Test for the existance of the file in DB', () => {
            var myTestFile = UploadFile.findFileToBeDeleted("0137c9b2e0415202");;
            assert.isNotNull(myTestFile, 'great, time for tea!');

        });
        it('Test for the type of the file in DB', () => {
            var myTestFile = UploadFile.findFileToBeDeleted("0137c9b2e0415202");;
            assert.isNotObject(myTestFile, 'not an object');

        });
    });
    describe("Unit Test for cRonJob", () => {
        beforeEach(function () {
            this.sinon.stub(console, 'log');
        });
        it("Should check cRonJob", () => {
            job.start();
            expect(console.log.calledWith('Cron Job running')).to.be.false;
        });
    });
});


describe("Integration Test", () => {
    it("Upload file to endpoint", (done) => {
        request(app)
            .post("/files")
            .field("urlExpiryTime", "2")
            .attach("upload", path.resolve(__dirname, "files/node_logo.png"))
            .expect(200)
        done();
    });
    it('Gets file from endpoint', (done) => {
        request(app).get("/files/")
            .expect(200)
        done();
    });
});