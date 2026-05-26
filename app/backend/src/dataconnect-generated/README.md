# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetAnimalReportsByUser*](#getanimalreportsbyuser)
  - [*GetAllRescueOrganizations*](#getallrescueorganizations)
- [**Mutations**](#mutations)
  - [*CreateUserReport*](#createuserreport)
  - [*AssignReportToOrganization*](#assignreporttoorganization)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetAnimalReportsByUser
You can execute the `GetAnimalReportsByUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getAnimalReportsByUser(options?: ExecuteQueryOptions): QueryPromise<GetAnimalReportsByUserData, undefined>;

interface GetAnimalReportsByUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAnimalReportsByUserData, undefined>;
}
export const getAnimalReportsByUserRef: GetAnimalReportsByUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAnimalReportsByUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetAnimalReportsByUserData, undefined>;

interface GetAnimalReportsByUserRef {
  ...
  (dc: DataConnect): QueryRef<GetAnimalReportsByUserData, undefined>;
}
export const getAnimalReportsByUserRef: GetAnimalReportsByUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAnimalReportsByUserRef:
```typescript
const name = getAnimalReportsByUserRef.operationName;
console.log(name);
```

### Variables
The `GetAnimalReportsByUser` query has no variables.
### Return Type
Recall that executing the `GetAnimalReportsByUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAnimalReportsByUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAnimalReportsByUserData {
  animalReports: ({
    id: UUIDString;
    animalType: string;
    conditionDescription: string;
    latitude: number;
    longitude: number;
    status: string;
    createdAt: TimestampString;
    photoUrl?: string | null;
    lastSeenAt?: TimestampString | null;
  } & AnimalReport_Key)[];
}
```
### Using `GetAnimalReportsByUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAnimalReportsByUser } from '@dataconnect/generated';


// Call the `getAnimalReportsByUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAnimalReportsByUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAnimalReportsByUser(dataConnect);

console.log(data.animalReports);

// Or, you can use the `Promise` API.
getAnimalReportsByUser().then((response) => {
  const data = response.data;
  console.log(data.animalReports);
});
```

### Using `GetAnimalReportsByUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAnimalReportsByUserRef } from '@dataconnect/generated';


// Call the `getAnimalReportsByUserRef()` function to get a reference to the query.
const ref = getAnimalReportsByUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAnimalReportsByUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.animalReports);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.animalReports);
});
```

## GetAllRescueOrganizations
You can execute the `GetAllRescueOrganizations` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getAllRescueOrganizations(options?: ExecuteQueryOptions): QueryPromise<GetAllRescueOrganizationsData, undefined>;

interface GetAllRescueOrganizationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAllRescueOrganizationsData, undefined>;
}
export const getAllRescueOrganizationsRef: GetAllRescueOrganizationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAllRescueOrganizations(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetAllRescueOrganizationsData, undefined>;

interface GetAllRescueOrganizationsRef {
  ...
  (dc: DataConnect): QueryRef<GetAllRescueOrganizationsData, undefined>;
}
export const getAllRescueOrganizationsRef: GetAllRescueOrganizationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAllRescueOrganizationsRef:
```typescript
const name = getAllRescueOrganizationsRef.operationName;
console.log(name);
```

### Variables
The `GetAllRescueOrganizations` query has no variables.
### Return Type
Recall that executing the `GetAllRescueOrganizations` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAllRescueOrganizationsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAllRescueOrganizationsData {
  rescueOrganizations: ({
    id: UUIDString;
    name: string;
    contactEmail: string;
    contactPhone: string;
    website?: string | null;
    serviceArea?: string | null;
    createdAt: TimestampString;
  } & RescueOrganization_Key)[];
}
```
### Using `GetAllRescueOrganizations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAllRescueOrganizations } from '@dataconnect/generated';


// Call the `getAllRescueOrganizations()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAllRescueOrganizations();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAllRescueOrganizations(dataConnect);

console.log(data.rescueOrganizations);

// Or, you can use the `Promise` API.
getAllRescueOrganizations().then((response) => {
  const data = response.data;
  console.log(data.rescueOrganizations);
});
```

### Using `GetAllRescueOrganizations`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAllRescueOrganizationsRef } from '@dataconnect/generated';


// Call the `getAllRescueOrganizationsRef()` function to get a reference to the query.
const ref = getAllRescueOrganizationsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAllRescueOrganizationsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.rescueOrganizations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.rescueOrganizations);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUserReport
You can execute the `CreateUserReport` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUserReport(vars: CreateUserReportVariables): MutationPromise<CreateUserReportData, CreateUserReportVariables>;

interface CreateUserReportRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserReportVariables): MutationRef<CreateUserReportData, CreateUserReportVariables>;
}
export const createUserReportRef: CreateUserReportRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUserReport(dc: DataConnect, vars: CreateUserReportVariables): MutationPromise<CreateUserReportData, CreateUserReportVariables>;

interface CreateUserReportRef {
  ...
  (dc: DataConnect, vars: CreateUserReportVariables): MutationRef<CreateUserReportData, CreateUserReportVariables>;
}
export const createUserReportRef: CreateUserReportRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserReportRef:
```typescript
const name = createUserReportRef.operationName;
console.log(name);
```

### Variables
The `CreateUserReport` mutation requires an argument of type `CreateUserReportVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserReportVariables {
  animalType: string;
  conditionDescription: string;
  latitude: number;
  longitude: number;
  photoUrl?: string | null;
}
```
### Return Type
Recall that executing the `CreateUserReport` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserReportData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserReportData {
  animalReport_insert: AnimalReport_Key;
}
```
### Using `CreateUserReport`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUserReport, CreateUserReportVariables } from '@dataconnect/generated';

// The `CreateUserReport` mutation requires an argument of type `CreateUserReportVariables`:
const createUserReportVars: CreateUserReportVariables = {
  animalType: ..., 
  conditionDescription: ..., 
  latitude: ..., 
  longitude: ..., 
  photoUrl: ..., // optional
};

// Call the `createUserReport()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUserReport(createUserReportVars);
// Variables can be defined inline as well.
const { data } = await createUserReport({ animalType: ..., conditionDescription: ..., latitude: ..., longitude: ..., photoUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUserReport(dataConnect, createUserReportVars);

console.log(data.animalReport_insert);

// Or, you can use the `Promise` API.
createUserReport(createUserReportVars).then((response) => {
  const data = response.data;
  console.log(data.animalReport_insert);
});
```

### Using `CreateUserReport`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserReportRef, CreateUserReportVariables } from '@dataconnect/generated';

// The `CreateUserReport` mutation requires an argument of type `CreateUserReportVariables`:
const createUserReportVars: CreateUserReportVariables = {
  animalType: ..., 
  conditionDescription: ..., 
  latitude: ..., 
  longitude: ..., 
  photoUrl: ..., // optional
};

// Call the `createUserReportRef()` function to get a reference to the mutation.
const ref = createUserReportRef(createUserReportVars);
// Variables can be defined inline as well.
const ref = createUserReportRef({ animalType: ..., conditionDescription: ..., latitude: ..., longitude: ..., photoUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserReportRef(dataConnect, createUserReportVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.animalReport_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.animalReport_insert);
});
```

## AssignReportToOrganization
You can execute the `AssignReportToOrganization` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
assignReportToOrganization(vars: AssignReportToOrganizationVariables): MutationPromise<AssignReportToOrganizationData, AssignReportToOrganizationVariables>;

interface AssignReportToOrganizationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AssignReportToOrganizationVariables): MutationRef<AssignReportToOrganizationData, AssignReportToOrganizationVariables>;
}
export const assignReportToOrganizationRef: AssignReportToOrganizationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
assignReportToOrganization(dc: DataConnect, vars: AssignReportToOrganizationVariables): MutationPromise<AssignReportToOrganizationData, AssignReportToOrganizationVariables>;

interface AssignReportToOrganizationRef {
  ...
  (dc: DataConnect, vars: AssignReportToOrganizationVariables): MutationRef<AssignReportToOrganizationData, AssignReportToOrganizationVariables>;
}
export const assignReportToOrganizationRef: AssignReportToOrganizationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the assignReportToOrganizationRef:
```typescript
const name = assignReportToOrganizationRef.operationName;
console.log(name);
```

### Variables
The `AssignReportToOrganization` mutation requires an argument of type `AssignReportToOrganizationVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AssignReportToOrganizationVariables {
  reportId: UUIDString;
  organizationId: UUIDString;
}
```
### Return Type
Recall that executing the `AssignReportToOrganization` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AssignReportToOrganizationData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AssignReportToOrganizationData {
  reportAssignment_insert: ReportAssignment_Key;
}
```
### Using `AssignReportToOrganization`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, assignReportToOrganization, AssignReportToOrganizationVariables } from '@dataconnect/generated';

// The `AssignReportToOrganization` mutation requires an argument of type `AssignReportToOrganizationVariables`:
const assignReportToOrganizationVars: AssignReportToOrganizationVariables = {
  reportId: ..., 
  organizationId: ..., 
};

// Call the `assignReportToOrganization()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await assignReportToOrganization(assignReportToOrganizationVars);
// Variables can be defined inline as well.
const { data } = await assignReportToOrganization({ reportId: ..., organizationId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await assignReportToOrganization(dataConnect, assignReportToOrganizationVars);

console.log(data.reportAssignment_insert);

// Or, you can use the `Promise` API.
assignReportToOrganization(assignReportToOrganizationVars).then((response) => {
  const data = response.data;
  console.log(data.reportAssignment_insert);
});
```

### Using `AssignReportToOrganization`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, assignReportToOrganizationRef, AssignReportToOrganizationVariables } from '@dataconnect/generated';

// The `AssignReportToOrganization` mutation requires an argument of type `AssignReportToOrganizationVariables`:
const assignReportToOrganizationVars: AssignReportToOrganizationVariables = {
  reportId: ..., 
  organizationId: ..., 
};

// Call the `assignReportToOrganizationRef()` function to get a reference to the mutation.
const ref = assignReportToOrganizationRef(assignReportToOrganizationVars);
// Variables can be defined inline as well.
const ref = assignReportToOrganizationRef({ reportId: ..., organizationId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = assignReportToOrganizationRef(dataConnect, assignReportToOrganizationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.reportAssignment_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.reportAssignment_insert);
});
```

