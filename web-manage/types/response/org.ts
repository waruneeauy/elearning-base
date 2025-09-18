interface OrgResponse {
  id: string;
  logo: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date | null;
  updatedBy: string | null;
}

interface Option {
  value: boolean;
  label: string;
}

export type { OrgResponse, Option };
