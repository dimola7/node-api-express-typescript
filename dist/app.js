"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import createError from 'http-errors';
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let app = express_1.default();
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
let filePath = path_1.default.join(__dirname, './database.json');
console.log(filePath);
// add a new organisation
app.post('/orgs', (req, res) => {
    const database = fs_1.default.readFileSync(filePath, "utf-8");
    if (!req.body.organisation || !req.body.products || !req.body.marketValue || !req.body.address || !req.body.ceo || !req.body.country || !req.body.noOfEmployees || !req.body.employees) {
        return res.status(404).send("Please fill in all required fields");
    }
    const parsedData = JSON.parse(database);
    const lastId = parsedData[parsedData.length - 1].id;
    if (lastId) {
        const newId = lastId + 1;
        const org = {
            organisation: req.body.organisation,
            createdAt: new Date(),
            products: req.body.products,
            marketValue: req.body.marketValue,
            address: req.body.address,
            ceo: req.body.ceo,
            country: req.body.country,
            id: newId,
            noOfEmployees: req.body.noOfEmployees,
            employees: req.body.employees,
        };
        parsedData.push(org);
        fs_1.default.writeFileSync(filePath, JSON.stringify(parsedData, null, 2));
        res.status(201).json({
            status: 'success',
            data: org
        });
    }
});
// get all organisations
app.get('/orgs', (req, res) => {
    const database = fs_1.default.readFileSync(filePath, "utf-8");
    const parsedData = JSON.parse(database);
    res.status(200).json({
        status: 'success',
        data: parsedData
    });
});
// get single organisation
app.get('/orgs/:id', (req, res) => {
    const database = fs_1.default.readFileSync(filePath, "utf-8");
    // get the id of the organisation
    const organisation = JSON.parse(database).find((org) => org.id === parseInt(req.params.id));
    if (!organisation)
        return res.status(404).send("the organisation with the given ID was not found");
    res.status(200).json({
        status: 'success',
        data: organisation
    });
});
// update an organisation
app.put('/orgs/:id', (req, res) => {
    const database = fs_1.default.readFileSync(filePath, "utf-8");
    // get the id of the organisation
    const organisation = JSON.parse(database).find((org) => org.id === parseInt(req.params.id));
    const organisationIndex = JSON.parse(database).findIndex((org) => org.id === parseInt(req.params.id));
    if (!organisation)
        return res.status(404).send("the organisation with the given ID was not found");
    const newOrg = { ...organisation, ...req.body, updatedAt: new Date() };
    const parsedData = JSON.parse(database);
    parsedData.splice(organisationIndex, 1, newOrg);
    fs_1.default.writeFileSync(filePath, JSON.stringify(parsedData, null, 2));
    res.status(200).json({
        status: 'success',
        data: newOrg
    });
});
// delete an organisation
app.delete('/orgs/:id', (req, res) => {
    const database = fs_1.default.readFileSync(filePath, "utf-8");
    // get the id of the organisation
    const organisation = JSON.parse(database).find((org) => org.id === parseInt(req.params.id));
    const organisationIndex = JSON.parse(database).findIndex((org) => org.id === parseInt(req.params.id));
    if (Object.keys(organisation).length === 0)
        return res.status(404).send({
            status: 'error',
            message: 'could not find org'
        });
    const parsedData = JSON.parse(database);
    parsedData.splice(organisationIndex, 1);
    fs_1.default.writeFileSync(filePath, JSON.stringify(parsedData, null, 2));
    return res.status(200).send({
        status: 'success',
        message: 'organisation deleted'
    });
});
//
exports.default = app;
