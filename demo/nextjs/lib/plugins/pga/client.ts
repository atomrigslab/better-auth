import { type BetterAuthClientPlugin } from 'better-auth';
import type { pga } from './';

type PgaPlugin = typeof pga;

export const pgaClientPlugin = () => {
	return {
		id: 'pga',
		$InferServerPlugin: {} as ReturnType<PgaPlugin>
	} satisfies BetterAuthClientPlugin;
};
