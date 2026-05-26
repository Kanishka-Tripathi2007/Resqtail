# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUserReport, getAnimalReportsByUser, getAllRescueOrganizations, assignReportToOrganization } from '@dataconnect/generated';


// Operation CreateUserReport:  For variables, look at type CreateUserReportVars in ../index.d.ts
const { data } = await CreateUserReport(dataConnect, createUserReportVars);

// Operation GetAnimalReportsByUser: 
const { data } = await GetAnimalReportsByUser(dataConnect);

// Operation GetAllRescueOrganizations: 
const { data } = await GetAllRescueOrganizations(dataConnect);

// Operation AssignReportToOrganization:  For variables, look at type AssignReportToOrganizationVars in ../index.d.ts
const { data } = await AssignReportToOrganization(dataConnect, assignReportToOrganizationVars);


```