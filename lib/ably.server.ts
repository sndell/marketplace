import * as Ably from 'ably';

export const ablyServer = new Ably.Rest(process.env.ABLY_SERVER_KEY!);
