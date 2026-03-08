import { createClient } from '@insforge/sdk'

const insforgeClient = createClient({
    baseUrl: 'https://s4rni5gk.us-east.insforge.app',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTQxOTJ9.YL71nRL_QH5FN4bx8E0WbPGNNy9FfylDmnpnFMXOfGs',
})

export default insforgeClient
