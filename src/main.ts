import { throwIfMissing } from './utils';

// This is your Appwrite function
// It's executed each time we get a request
const CORS = {
    'Access-Control-Allow-Origin': Bun.env['ACCESS_ORIGIN'],
    'Access-Control-Allow-Headers': 'Content-Type',
};

export default async ({ req, res, log, error }: any) => {
    log(req);

    throwIfMissing(Bun.env, ['ACCESS_ORIGIN', 'APPWRITE_API_KEY', 'PROJECT_ID', 'DATABASE_ID']);

    return res.json({ ok: false, error: 'bad request' }, 200, CORS);
};
