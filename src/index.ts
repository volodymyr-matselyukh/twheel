import axios from "axios";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as util from "util";
import { getUtcDateTimeString } from "./dateUtils";
import { AxiosError } from "axios";

dotenv.config();

const ACCOUNTS = JSON.parse(process.env.ACCOUNTS!) as unknown as [
  {
    name: string;
    securityCookie: string;
    nextRun: Date;
  }
];

const getRandomNumber = (upperLimit: number) => {
  return Math.round(Math.random() * upperLimit);
};

ACCOUNTS.forEach((account) => {
  const nextRun = new Date();
  nextRun.setMinutes(nextRun.getMinutes() + getRandomNumber(80));
  account.nextRun = nextRun;
});

const WHITE_LIST = [
  "volodymyr",
  "oneplusone",
  "whale",
  "xiomi",
  "oksana",
  "gt_turbo",
  "micro_strategy",
  "ukraine_number_1",
  "papa_pepe",
  "father_btc",
  "red_frog_lover",
  "drug_diller",
  "machine_gun",
  "eagerdev",
  "guinea_pig",
  "freddy_kruger",
  "santa_lucia",
  "monika_belucci",
  "mercury_m",
  "empty_fridge",
  "sponge_bob",
  "venomancer",
  "volodymyr_zelenskyi",
  "petro_poroshenko",
  "kicia_kocia",
];

const maxFailuresBeforeLog = 30;
const ONE_MINUTE = 60000;

const SECURITY_COOKIE_BEGINNING =
  "wordpress_sec_e8545d4d14fb7e95140409c6df04e61f=";

function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const bombardWithPostTransactions = async (accountName: string) => {
  let score = 0;
  try {
    const bodyFormData = new FormData();

    bodyFormData.append("action", "spinWellOfFortuneStateless");
    bodyFormData.append("transactionId", "-");
    bodyFormData.append("pageId", "68769");

    const accountConfig = ACCOUNTS.find(
      (account) => account.name === accountName
    );
    if (!accountConfig) {
      throw new Error(`Account ${accountName} not found`);
    }

    const response = await axios.post(
      "https://learnnear.club/wp-admin/admin-ajax.php",
      bodyFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data;",
          Cookie: SECURITY_COOKIE_BEGINNING + accountConfig.securityCookie,
        },
      }
    );

    if (response.data === "Something goes wrong please try again later") {
      return 0;
    }

    score = response.data.split(" ")[0];
  } catch (err: unknown) {
    const error = err as AxiosError;
    const message: any = {};

    if (error.response) {
      message.data = error.response.data;
      message.status = error.response.status;
      message.headers = error.response.headers;
    } 
    
    if (error.request) {
      message.request = error.request;
    } 
    
    message.message = error.message;
    

    console.log(`error running promise`, JSON.stringify(message));
  }

  return score;
};

const logToFile = function (logString: string) {
  fs.appendFileSync("./log", util.format(logString) + "\n");
};

const tryExecuteWithTimeMeasurement = async (
  callback?: () => Promise<number>
) => {
  try {
    const precision = 3; // 3 decimal places
    const start = process.hrtime();

    const result = await callback?.();

    const elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
    return { result, time: elapsed.toFixed(precision) };
  } catch (error) {
    console.log("error measuring time");
    throw error;
  }
};

export const spinWheelSingleTime = async (
  accountName: string,
  successCallback?: (log: string) => void,
  errorCallback?: (log: string) => void
) => {
  try {
    const { result } = await tryExecuteWithTimeMeasurement(
      async () => await bombardWithPostTransactions(accountName)
    );

    const logToFileString = `${accountName} score: ${result}; ${getUtcDateTimeString(
      new Date()
    )}`;

    if (!result || result === 0) {
      errorCallback?.(logToFileString);
    } else {
      successCallback?.(logToFileString);
    }

    logToFile(logToFileString);

    return logToFileString;
  } catch (error) {
    errorCallback?.("unhandled error");
    console.log("error executing main", JSON.stringify(error));
    return "error executing main";
  }
};

const runSpinningWheelInALoop = () => {
  setInterval(async () => {
    const promises: Promise<string>[] = [];
    const dateTimeNow = new Date();

    for (let account of ACCOUNTS) {
      if (account.nextRun < dateTimeNow) {
        const successCallback = (log: string) => {
          const nextRun = getNextRunSuccess(account.name);

          account.nextRun = nextRun;
          console.log(log, "next run:", getUtcDateTimeString(account.nextRun));
        };

        const errorCallback = (log: string) => {
          const nextRun = getNextRunFailure(account.name);

          account.nextRun = nextRun;
          console.log(
            "run failed",
            log,
            "next run:",
            account.nextRun.toUTCString()
          );
        };

        const spinWheelPromise = spinWheelSingleTime(
          account.name,
          successCallback,
          errorCallback
        );

        promises.push(spinWheelPromise);
      }
    }

    await Promise.all(promises);
  }, ONE_MINUTE);
};

const getNextRunSuccess = (account_name: string) => {
  const dateTimeNow = new Date();
  const utcHours = dateTimeNow.getUTCHours();
  const isWhiteListed = WHITE_LIST.includes(account_name);

  const nextRun = new Date();

  if (!isWhiteListed) {
    nextRun.setMinutes(new Date().getMinutes() + 60);

    return nextRun;
  }

  if (utcHours > 22) {
    nextRun.setHours(nextRun.getHours() + 5 + getRandomNumber(3));
    console.log("it's too late. I go to bed", account_name);
  }

  nextRun.setMinutes(new Date().getMinutes() + 60 + getRandomNumber(20));

  return nextRun;
};

const getNextRunFailure = (account_name: string) => {
  const dateTimeNow = new Date();
  const utcHours = dateTimeNow.getUTCHours();
  const isWhiteListed = WHITE_LIST.includes(account_name);

  const nextRun = new Date();
  if (isWhiteListed && utcHours > 22) {
    nextRun.setHours(nextRun.getHours() + 5 + getRandomNumber(3));
    console.log("it's too late. I go to bed", account_name);
  }

  nextRun.setMinutes(new Date().getMinutes() + getRandomNumber(10));

  return nextRun;
};

const main = async () => {
  const nextRunDelay = 0;
  await delay(nextRunDelay);

  runSpinningWheelInALoop();
};

// const main = async () => {
//   await spinWheelSingleTime("micro_strategy", () => {});
// };

main();
