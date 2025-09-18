import { CustomRequest } from "./request.interface";

export interface CreateOrg {
  logo: string;
  name: string;
  isActive: boolean;
}

export interface RequestCreateOrg extends CustomRequest {
  body: CreateOrg;
}

export interface OrgCreateSectionSet {
  orgId: string;
  setImage: string;
  setName: string;
  setDesc: string;
  isActive: boolean;
  isRandom: boolean;
}

export interface RequestOrgCreateSectionSet extends CustomRequest {
  body: OrgCreateSectionSet;
}

export interface UserGenerateCode {
  amount: number;
  customerId: string;
  courseId: string;
}

export interface RequestUserGenerateCode extends CustomRequest {
  body: UserGenerateCode;
}

export interface CloneSet {
  type: string;
  setNo: string;
  orgId?: string;
}

export interface RequestCloneSet extends CustomRequest {
  body: CloneSet;
}

export interface UserGenerateCode {
  amount: number;
  orgId: string;
  setNo: string;
  expiredAt: Date;
  deadlineDate: Date;
}

export interface RequestUserGenerateCode extends CustomRequest {
  body: UserGenerateCode;
}
export interface UpdateDate {
  expiredAt: Date;
  deadlineDate: Date;
}
export interface RequestUpdateDate extends CustomRequest {
  body: UpdateDate;
}
