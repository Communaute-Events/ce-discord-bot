export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
        BOT_TOKEN: string,
        CLIENT_ID: any,
        SOCKET_URL: string,
        MONGO_URI: string
    }
  }
}