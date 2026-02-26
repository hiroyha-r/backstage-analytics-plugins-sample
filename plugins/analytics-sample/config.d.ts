export interface Config {
    app?: {
        analytics?: {
            sample?: {
                /**
                 * The HTTP endpoint to send analytics events to.
                 * @visibility frontend
                 */
                endpoint?: string;
                /**
                 * The interval in milliseconds to flush analytics events.
                 * @visibility frontend
                 */
                flushIntervalMs?: number;
            }
        }
    }
}