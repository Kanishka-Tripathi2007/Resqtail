import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AnimalReport_Key {
  id: UUIDString;
  __typename?: 'AnimalReport_Key';
}

export interface AssignReportToOrganizationData {
  reportAssignment_insert: ReportAssignment_Key;
}

export interface AssignReportToOrganizationVariables {
  reportId: UUIDString;
  organizationId: UUIDString;
}

export interface CreateUserReportData {
  animalReport_insert: AnimalReport_Key;
}

export interface CreateUserReportVariables {
  animalType: string;
  conditionDescription: string;
  latitude: number;
  longitude: number;
  photoUrl?: string | null;
}

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

export interface Message_Key {
  id: UUIDString;
  __typename?: 'Message_Key';
}

export interface ReportAssignment_Key {
  id: UUIDString;
  __typename?: 'ReportAssignment_Key';
}

export interface RescueOrganization_Key {
  id: UUIDString;
  __typename?: 'RescueOrganization_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserReportRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserReportVariables): MutationRef<CreateUserReportData, CreateUserReportVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserReportVariables): MutationRef<CreateUserReportData, CreateUserReportVariables>;
  operationName: string;
}
export const createUserReportRef: CreateUserReportRef;

export function createUserReport(vars: CreateUserReportVariables): MutationPromise<CreateUserReportData, CreateUserReportVariables>;
export function createUserReport(dc: DataConnect, vars: CreateUserReportVariables): MutationPromise<CreateUserReportData, CreateUserReportVariables>;

interface GetAnimalReportsByUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAnimalReportsByUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetAnimalReportsByUserData, undefined>;
  operationName: string;
}
export const getAnimalReportsByUserRef: GetAnimalReportsByUserRef;

export function getAnimalReportsByUser(options?: ExecuteQueryOptions): QueryPromise<GetAnimalReportsByUserData, undefined>;
export function getAnimalReportsByUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetAnimalReportsByUserData, undefined>;

interface GetAllRescueOrganizationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAllRescueOrganizationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetAllRescueOrganizationsData, undefined>;
  operationName: string;
}
export const getAllRescueOrganizationsRef: GetAllRescueOrganizationsRef;

export function getAllRescueOrganizations(options?: ExecuteQueryOptions): QueryPromise<GetAllRescueOrganizationsData, undefined>;
export function getAllRescueOrganizations(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetAllRescueOrganizationsData, undefined>;

interface AssignReportToOrganizationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AssignReportToOrganizationVariables): MutationRef<AssignReportToOrganizationData, AssignReportToOrganizationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AssignReportToOrganizationVariables): MutationRef<AssignReportToOrganizationData, AssignReportToOrganizationVariables>;
  operationName: string;
}
export const assignReportToOrganizationRef: AssignReportToOrganizationRef;

export function assignReportToOrganization(vars: AssignReportToOrganizationVariables): MutationPromise<AssignReportToOrganizationData, AssignReportToOrganizationVariables>;
export function assignReportToOrganization(dc: DataConnect, vars: AssignReportToOrganizationVariables): MutationPromise<AssignReportToOrganizationData, AssignReportToOrganizationVariables>;

