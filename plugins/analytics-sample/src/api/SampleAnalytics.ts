import { 
    AnalyticsApi,
    AnalyticsEvent,
    IdentityApi,
} from "@backstage/core-plugin-api"
import { Config } from "@backstage/config";

export interface SampleAnalyticsOptions {
    endpoint?: string;
    flushIntervalMs: number;
}

export class SampleAnalytics implements AnalyticsApi {
    private readonly endpoint?: string;
    private buffer: AnalyticsEvent[] = [];
    private readonly headers: Record<string, string>;
    private flushTimer?: ReturnType<typeof setInterval>;

    static fromConfig(configApi: Config, _options: { identityApi: IdentityApi }): SampleAnalytics {
        const endpoint = configApi.getOptionalString('app.analytics.sample.endpoint');
        console.log('endpoint:', endpoint);
        const flushIntervalMs = configApi.getOptionalNumber('app.analytics.sample.flushIntervalMs') ?? 5000; 
        console.log('flushIntervalMs:', flushIntervalMs);
        return new SampleAnalytics({ endpoint, flushIntervalMs });
    }

    private constructor(options: SampleAnalyticsOptions) {
        this.endpoint = options.endpoint;
        this.headers = {
            'Content-Type': 'application/json',
        };
        const intervalMs = options.flushIntervalMs;
        this.flushTimer = setInterval(() => this.flush(), intervalMs);
    }
    
    captureEvent(event: AnalyticsEvent) {
        console.log('--- Analytics Event Captured ---');
        console.log('Action:', event.action);
        console.log('Subject:', event.subject);
        console.log('Context:', event.context);
        console.log('Attributes:', event.attributes);
        if (this.endpoint) {
            this.buffer.push({
                ...event,
                context: {
                    ...event.context,
                    timestamp: new Date().toISOString(),
                },
            });
        }
    }

    async flush(): Promise<void> {
        if (!this.endpoint) {
            console.log('no endpoint configured, skipping flush');
            return;
        }
        if (this.buffer.length === 0) {
            console.log('no events to flush');
            return;
        }

        const events = [...this.buffer];
        this.buffer = [];

        try {
            const body = JSON.stringify({ events });
            await fetch(this.endpoint, {
                method: 'POST',
                mode: 'cors',
                headers: this.headers,
                body: body,
            });
            console.log('events flushed:', body);
        } catch (error) {
            console.error('Error flushing analytics events:', error);
            this.buffer.unshift(...events);
        }
    }

    dispose(): void {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
            this.flushTimer = undefined;
        }
        this.flush();
    }
}
