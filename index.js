import axios from 'axios';
import fs from 'fs';
import util from 'util';
import dotenv from 'dotenv';

dotenv.config();

const maxFailuresBeforeLog = 30;

let nextRunDate = new Date().setMinutes(new Date().getMinutes() + 28);

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

let invalidTriesCounter = 0;

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
            invalidTriesCounter ++;

            if(invalidTriesCounter >= maxFailuresBeforeLog)
            {
                console.log('still blocked', new Date().toString());
                invalidTriesCounter = 0;
            }
        }
        else
        {
            invalidTriesCounter = 0;
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
            await spinWheelSingleTime(() => {
                nextRunDate = new Date().setMinutes(new Date().getMinutes() + 58);
            });
        } 
        
        await delay(1000);
    }
}

await main();