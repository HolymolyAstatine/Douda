declare namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      NEIS_API_KEY:string;
      DB_USER:string;
      DB_HOST:string;
      DB_NAME:string;
      DB_PASS:string;
      DB_PORT?:string;
    }
  }
  