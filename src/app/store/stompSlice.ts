/* eslint-disable */
// STUB — STOMP removed; live game uses Socket.io

export const addSubscription = (_v: any) => ({ type: 'stub/addSubscription' })
export const removeSubscription = (_v: any) => ({ type: 'stub/removeSubscription' })

export default function stompReducer(state = { subscriptions: [] }, _action: any) {
  return state
}
