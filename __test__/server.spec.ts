import request from 'supertest';
import app from '../app';

interface OrganisationDB {
    organisation: string,
    products: string[],
    marketValue: string,
    address: string,
    ceo: string,
    country: string,
    id?: number,
    noOfEmployees: number,
    employees: string[],
}
let id: string = '';
let orgData: OrganisationDB | {} = {};

const data: OrganisationDB = {
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
}

describe("Test to create an organisation", () => {
    it("should create an organisation", async () => {
        const res = await request(app).post('/orgs').send(data);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("data");
        expect(res.body).toHaveProperty("status");
        expect(res.body.status).toBe("success");

        id = res.body.data.id;
        orgData = res.body.data;

        console.log(`***-FIRST-ID${id}`);

    })
})

describe("Test to get organisations", () => {
    it("should get all organisations", async () => {
        const res = await request(app).get('/orgs').send(data);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("data");
        expect(res.body).toHaveProperty("status");
        expect(res.body.status).toBe("success")
    });

    it("should get a single selected organisation", async () => {
        const res = await request(app).get(`/orgs/${id}`).send(data);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("data");
        expect(res.body).toHaveProperty("status");
        expect(res.body.data).toMatchObject(orgData);
    })
})

describe("Test to update organisation", () => {
    it("should update an organisation", async () => {
        data.marketValue = "100%";

        const res = await request(app).put(`/orgs/${id}`).send(data);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("data");
        expect(res.body).toHaveProperty("status");
        expect(res.body.data.marketValue).toBe("100%")
    })
})

describe("Test to delete organisation", () => {
    it("should delete a selected organisation", async () => {
        const res = await request(app).delete(`/orgs/${id}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("status");
        expect(res.body.status).toBe("success")
    })
})