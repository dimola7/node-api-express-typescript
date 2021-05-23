"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
let id = '';
let orgData = {};
const data = {
    organisation: "ibrt",
    products: [
        "pizza"
    ],
    marketValue: "90%",
    address: "paris",
    ceo: "cn",
    country: "France",
    noOfEmployees: 2,
    employees: [
        "antoinne pier",
        "madelline jacque"
    ]
};
describe("Test to create an organisation", () => {
    it("should create an organisation", async () => {
        const res = await supertest_1.default(app_1.default).post('/orgs').send(data);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("data");
        expect(res.body).toHaveProperty("status");
        expect(res.body.status).toBe("success");
        id = res.body.data.id;
        orgData = res.body.data;
        console.log(`***-FIRST-ID${id}`);
    });
});
describe("Test to get organisations", () => {
    it("should get all organisations", async () => {
        const res = await supertest_1.default(app_1.default).get('/orgs').send(data);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("data");
        expect(res.body).toHaveProperty("status");
        expect(res.body.status).toBe("success");
    });
    it("should get a single selected organisation", async () => {
        const res = await supertest_1.default(app_1.default).get(`/orgs/${id}`).send(data);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("data");
        expect(res.body).toHaveProperty("status");
        expect(res.body.data).toMatchObject(orgData);
    });
});
describe("Test to update organisation", () => {
    it("should update an organisation", async () => {
        data.marketValue = "100%";
        const res = await supertest_1.default(app_1.default).put(`/orgs/${id}`).send(data);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("data");
        expect(res.body).toHaveProperty("status");
        expect(res.body.data.marketValue).toBe("100%");
    });
});
describe("Test to delete organisation", () => {
    it("should delete a selected organisation", async () => {
        const res = await supertest_1.default(app_1.default).delete(`/orgs/${id}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("status");
        expect(res.body.status).toBe("success");
    });
});
