export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
        token: string,
        clientId: any,
        mongoUri: string,
        socketUrl: string
    }
  }
}