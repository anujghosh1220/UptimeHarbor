import { EventBridgeEvent } from 'aws-lambda'

export const handler = async (_event: EventBridgeEvent<string, unknown>): Promise<void> => {
  // Scheduled health checks will be implemented here
}
