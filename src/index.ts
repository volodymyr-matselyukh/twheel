import axios from "axios";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as util from "util";

dotenv.config();

const ACCOUNTS = JSON.parse(process.env.ACCOUNTS!) as unknown as [
  {
    name: string;
    securityCookie: string;
    nextRun: Date;
  }
];

const getRandomMinutes = (upperLimit: number) => {
  return Math.round(Math.random() * upperLimit);
};

ACCOUNTS.forEach((account) => {
  const nextRun = new Date();
  nextRun.setMinutes(nextRun.getMinutes() + getRandomMinutes(10));
  account.nextRun = nextRun;
});

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
  } catch (error) {
    console.log(`error running promise`, error);
  }

  return score;
};

const logToFile = function (logString: string) {
  fs.appendFileSync("./log", util.format(logString) + "\n");
};

const tryExecuteWithTimeMeasurement = async (callback?: () => Promise<number>) => {
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
    const { result, time } = await tryExecuteWithTimeMeasurement(
      async () => await bombardWithPostTransactions(accountName)
    );

    const logToFileString = `${accountName} ${new Date().toUTCString()}; ${result}; ${time}`;

    if (!result || result === 0) {
      errorCallback?.(logToFileString);
    } else {
      successCallback?.(logToFileString);
    }

    logToFile(logToFileString);

    return logToFileString;
  } catch (error) {
    errorCallback?.("unhandled error");
    console.log("error executing main", error);
    return "error executing main";
  }
};

const runSpinningWheelInALoop = () => {
  setInterval(async () => {
    const dateTimeNow = new Date();
    const utcHours = dateTimeNow.getUTCHours();

    if(utcHours > 22 || utcHours < 7)
    {
      console.log("It's night time. No spinning the wheel");
      return;
    }

    const promises: Promise<string>[] = [];

    for (let account of ACCOUNTS) {
      if (account.nextRun < dateTimeNow) {
        const successCallback = (log: string) => {
          const nextRun = new Date();
          nextRun.setMinutes(
            new Date().getMinutes() + 60 + getRandomMinutes(20)
          );

          account.nextRun = nextRun;
          console.log(log, "next run:", account.nextRun.toUTCString());
        };

        const errorCallback = (log: string) => {
          const nextRun = new Date();
          nextRun.setMinutes(new Date().getMinutes() + getRandomMinutes(10));

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

const main = async () => {
  const nextRunDelay = 0;
  await delay(nextRunDelay);

  runSpinningWheelInALoop();
};

// const main = async () => {
//   await spinWheelSingleTime("volodymyr", () => {});
// };

main();