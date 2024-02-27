import { spinWheelSingleTime } from '../index.js';

export default async function handler(req, res) {
    const result = await spinWheelSingleTime();
    res.status(200).end(result);
}