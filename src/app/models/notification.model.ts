export enum NotificationType {
  DUE_DATE_APPROACHING = 'DUE_DATE_APPROACHING',
  TASK_OVERDUE = 'TASK_OVERDUE'
}

export interface Notification {
  id: string;
  taskId: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: Date;
}
