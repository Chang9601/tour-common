export enum Subject {
  BookingMade = 'booking:made',
  BookingCancelled = 'booking:cancelled',

  ExpirationCompleted = 'expiration:completed',

  PaymentMade = 'payment:made',

  ReviewCreated = 'review:created',
  ReviewUpdated = 'review:updated',
  ReviewDeleted = 'review:deleted',

  TourCancelled = 'tour:cancelled',
  TourCreated = 'tour:created',

  UserBanned = 'auth:banned',
  UserUnbanned = 'auth:unbanned',
}
