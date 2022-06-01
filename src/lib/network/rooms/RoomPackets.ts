/**
 * Have a datastore, which is a single key-value store
 * Function to create a checksum for the store
 * A system for creating data requests
 * A looping data validation system
 *  - Would probably work by broadcasting a checksum to all nodes periodically
 *  - When a checksum is received, if it doesn't match what we have, request the data from the sender
 *  - If somebody references data that we should have but don't, request it from the sender
 *  - This should handle disconnections pretty well.
 */