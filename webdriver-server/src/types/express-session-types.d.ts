/**
 * Naming this file express-session.d.ts causes imports from "express-session"
 * to reference this file and not the node_modules package.
 */

import session from "express-session-types";
import { UserData } from '@project/server/app/models';

declare module "express-session" {
    export interface SessionData {
        browserId: string;
        pageViews: number;
        returnTo: string;
        user: UserData
    }
}
