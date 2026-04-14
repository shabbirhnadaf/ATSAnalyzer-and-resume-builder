export const success = <T>(data: T, message = 'success') => ({
    success: true,
    message,
    data,
})


export const fail = (message = "Request failed", details?: unknown) => ({
    success: false,
    message,
    details
})