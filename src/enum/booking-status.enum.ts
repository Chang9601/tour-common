export enum BookingStatus {
  /* 예약 확정 */
  Confirmed = 'CONFIRMED',
  /* 예약 취소 */
  Cancelled = 'CANCELLED',
  /* 결제 대기 */
  AwaitingPyment = 'AWAITING_PAYMENT',
  /* 결제 완료 */
  Complete = 'COMPLETE',
}
