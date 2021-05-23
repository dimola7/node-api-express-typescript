// import createError from 'http-errors';
import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
// import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import fs from 'fs';
import path from "path";

// let indexRouter = require('./routes/index');
// let usersRouter = require('./routes/users');

let app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use((err:ErrorRequestHandler, req:Request, res:Response, next:NextFunction) => {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


interface OrganisationDB {
  organisation: string,
  createdAt?: Date,
  updatedAt?: Date,
  products: string[],
  marketValue: string,
  address: string,
  ceo: string,
  country: string,
  id?: number,
  noOfEmployees: number,
  employees: string[],
}

let filePath = path.join(__dirname, './database.json')

// get all organisations
app.get('/orgs', (req: Request, res: Response) => {
  const database = fs.readFileSync(filePath, "utf-8");
  const parsedData = JSON.parse(database);
  res.status(200).json({
    status: 'success',
    data: parsedData
  });
})

// get single organisation
app.get('/orgs/:id', (req: Request, res: Response) => {
  const database = fs.readFileSync(filePath, "utf-8");
  // get the id of the organisation
  const organisation = JSON.parse(database).find((org: { id: number; }) => org.id === parseInt(req.params.id));
  if (!organisation) return res.status(404).send("the organisation with the given ID was not found");

  res.status(200).json({
    status: 'success',
    data: organisation
  })
})

// add a new organisation
app.post('/orgs', (req: Request, res: Response) => {
  const database = fs.readFileSync(filePath, "utf-8");
  if (!req.body.organisation || !req.body.products || !req.body.marketValue || !req.body.address || !req.body.ceo || !req.body.country || !req.body.noOfEmployees || !req.body.employees) {
    return res.status(404).send("Please fill in all required fields");
  }
  const parsedData = JSON.parse(database)
  const lastId: number | undefined = parsedData[parsedData.length - 1].id;

  if (lastId) {
    const newId = lastId + 1
    const org: OrganisationDB = {
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
    }

    parsedData.push(org);

    fs.writeFileSync(filePath, JSON.stringify(parsedData, null, 2));
    res.status(201).json({
      status: 'success',
      data: org
    })
  }
})

// update an organisation
app.put('/orgs/:id', (req: Request, res: Response) => {
  const database = fs.readFileSync(filePath, "utf-8");
  // get the id of the organisation
  const organisation = JSON.parse(database).find((org: { id: number; }) => org.id === parseInt(req.params.id));
  const organisationIndex = JSON.parse(database).findIndex((org: { id: number; }) => org.id === parseInt(req.params.id));

  if (!organisation) return res.status(404).send("the organisation with the given ID was not found");

  const newOrg = { ...organisation, ...req.body, updatedAt: new Date() }
  const parsedData = JSON.parse(database);
  parsedData.splice(organisationIndex, 1, newOrg);
  fs.writeFileSync(filePath, JSON.stringify(parsedData, null, 2));

  res.status(200).json({
    status: 'success',
    data: newOrg
  });
})

// delete an organisation
app.delete('/orgs/:id', (req: Request, res: Response) => {
  const database = fs.readFileSync(filePath, "utf-8");
  // get the id of the organisation
  const organisation = JSON.parse(database).find((org: { id: number; }) => org.id === parseInt(req.params.id));
  const organisationIndex = JSON.parse(database).findIndex((org: { id: number; }) => org.id === parseInt(req.params.id));
  console.log(organisationIndex);

  if (!organisation) return res.status(404).send({
    status: 'success',
    message: 'could not find org'
  });

  const parsedData = JSON.parse(database);
  parsedData.splice(organisationIndex, 1);

  fs.writeFileSync(filePath, JSON.stringify(parsedData, null, 2));

  return res.status(200).send({
    status: 'success',
    message: 'organisation deleted'
  })
})

//

export default app;
