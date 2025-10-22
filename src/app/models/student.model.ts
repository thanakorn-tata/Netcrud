export interface Student {
  id: number;
  rowNum: number;
  fullname: string;
  university: string;
  faculty: string;
  major: string;
  contact_number: string;
  email: string;
  intern_department: string;
  intern_duration: string;
  attached_project?: string | null;
  grade?: string | null;
  created_by?: number | null;
  profile_file?: string | null;
  project_file?: string | null;
}
