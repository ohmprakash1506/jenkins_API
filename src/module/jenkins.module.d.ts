declare module 'jenkins-node-api' {
    export default class Jenkins {
        constructor(options: JenkinsOptions);
    }

    export interface JenkinsOptions {
        url: string;
        username: string;
        password: string;
      }
}