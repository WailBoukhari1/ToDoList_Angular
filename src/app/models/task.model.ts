export enum Priority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export enum Status {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: Priority;
  status: Status;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
