import axios from 'axios';
import fs from 'fs';
import util from 'util';
import dotenv from 'dotenv';

dotenv.config();

const maxFailuresBeforeLog = 30;

//let nextRunDate = new Date();
let nextRunDate = new Date().setMinutes(new Date().getMinutes() + 15);

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

const bombardWithPostTransactions = async () => {
    let score = 0;
    try{
        var bodyFormData = new FormData();
        bodyFormData.append('action', 'spinWellOfFortuneStateless');
        bodyFormData.append('transactionId', '-');
        bodyFormData.append('pageId', '63187');

        const response = await axios.post('https://learnnear.club/wp-admin/admin-ajax.php', 
        bodyFormData, {
            headers: {
                'Content-Type': 'multipart/form-data;',
                Cookie: process.env.cookie,
                Cookie: process.env.security_cookie,
            }
        });

        if(response.data === 'Something goes wrong please try again later')
        {
            return 0;
        }

        score = response.data.split(' ')[0];
    }
    catch(error){
        console.log(`error running promise`, error);
    }
    
    return score;
}


const logToFile = function(d) {
    fs.appendFileSync('./log', util.format(d) + '\n');
};


const tryBombarding = async (count) => {
    try{
        const result = await bombardWithPostTransactions(count);

        return result;
    }
    catch(error)
    {
        console.log('problem with bombarding');
    }
}

const tryExecuteWithTimeMeasurement = async (callback) => 
{
    try
    {
        const precision = 3; // 3 decimal places
        const start = process.hrtime();
        
        const result = await callback();
        
        const elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
        return { result, time: elapsed.toFixed(precision) };
    }
    catch(error){
        console.log('error measuring time');
    }
}

export const spinWheelSingleTime = async (successCallback) => {
    try {
        const { result, time} = await tryExecuteWithTimeMeasurement(async () => await tryBombarding(1));
        const logToFileString = `${new Date()}; ${result}; ${time}`;

        if(result === 0)
        {
            console.log('failed attempt', new Date().toString());
        }
        else
        {
            console.log(logToFileString);
        
            logToFile(`${new Date()}; ${result}; ${time}`);

            successCallback();
        }
        
        return logToFileString;
    }
    catch(error)
    {
        console.log('error executing main', error);
        return 'error executing main';
    }
}

const main = async () => {
    while(true)
    {
        const dateTimeNow = new Date();
        
        if(dateTimeNow > nextRunDate)
        {
            console.log('spinning wheel');
            await spinWheelSingleTime(() => {
                nextRunDate = new Date().setMinutes(new Date().getMinutes() + 60);
                console.log('next run', nextRunDate.toString());
            });
        } 
        
        await delay(10000);
    }
}

await main();