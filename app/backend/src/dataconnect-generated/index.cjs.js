const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs, makeMemoryCacheProvider } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'resqtail',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;
const dataConnectSettings = {
  cacheSettings: {
    cacheProvider: makeMemoryCacheProvider()
  }
};
exports.dataConnectSettings = dataConnectSettings;

const createUserReportRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUserReport', inputVars);
}
createUserReportRef.operationName = 'CreateUserReport';
exports.createUserReportRef = createUserReportRef;

exports.createUserReport = function createUserReport(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createUserReportRef(dcInstance, inputVars));
}
;

const getAnimalReportsByUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAnimalReportsByUser');
}
getAnimalReportsByUserRef.operationName = 'GetAnimalReportsByUser';
exports.getAnimalReportsByUserRef = getAnimalReportsByUserRef;

exports.getAnimalReportsByUser = function getAnimalReportsByUser(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getAnimalReportsByUserRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getAllRescueOrganizationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAllRescueOrganizations');
}
getAllRescueOrganizationsRef.operationName = 'GetAllRescueOrganizations';
exports.getAllRescueOrganizationsRef = getAllRescueOrganizationsRef;

exports.getAllRescueOrganizations = function getAllRescueOrganizations(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getAllRescueOrganizationsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const assignReportToOrganizationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AssignReportToOrganization', inputVars);
}
assignReportToOrganizationRef.operationName = 'AssignReportToOrganization';
exports.assignReportToOrganizationRef = assignReportToOrganizationRef;

exports.assignReportToOrganization = function assignReportToOrganization(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(assignReportToOrganizationRef(dcInstance, inputVars));
}
;
