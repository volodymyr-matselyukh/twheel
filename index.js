import axios from 'axios';
import fs from 'fs';
import util from 'util';
import dotenv from 'dotenv';

dotenv.config();

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

const spinWheelSingleTime = async () => {
    try {
        const { result, time} = await tryExecuteWithTimeMeasurement(async () => await tryBombarding(1));
        const logToFileString = `${new Date()}; ${result}; ${time}`;

        if(result === 0)
        {
            invalidTriesCounter ++;

            if(invalidTriesCounter >= 60)
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
        }
        
    }
    catch(error)
    {
        console.log('error executing main', error);
    }
}

const main = async () => {
    while(true)
    {
        await spinWheelSingleTime();
        await delay(1000);
    }
}

await main();