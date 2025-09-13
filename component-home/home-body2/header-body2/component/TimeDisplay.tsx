import React, { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  targetDate: Date;
}

const CountdownTimer: React.FC<CountdownProps> = ({ targetDate }) => {
  const calculateTimeLeft = (): TimeLeft | null => {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(
    calculateTimeLeft()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  const formatTwoDigits = (num: number): string =>
    num.toString().padStart(2, "0");

  return (
    <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-lg shadow-lg text-white mx-auto">
      <h2 className="text-xl  md:text-2xl font-bold mb-4 text-center">
        Les Soldes se terminent dans
      </h2>

      <div className="flex justify-center space-x-[2px] sm:space-x-4">
        {/* Jours */}
        <div className="flex flex-col items-center">
          <div className="flex">
            <DigitBox digit={formatTwoDigits(timeLeft.days)[0]} />
            <DigitBox digit={formatTwoDigits(timeLeft.days)[1]} />
          </div>
          <span className="text-[10px]  md:text-sm mt-1">JOURS</span>
        </div>

        <Separator />

        {/* Heures */}
        <div className="flex flex-col items-center">
          <div className="flex">
            <DigitBox digit={formatTwoDigits(timeLeft.hours)[0]} />
            <DigitBox digit={formatTwoDigits(timeLeft.hours)[1]} />
          </div>
          <span className="text-[10px]  md:text-sm mt-1">HEURES</span>
        </div>

        <Separator />

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div className="flex">
            <DigitBox digit={formatTwoDigits(timeLeft.minutes)[0]} />
            <DigitBox digit={formatTwoDigits(timeLeft.minutes)[1]} />
          </div>
          <span className="text-[10px]  md:text-sm mt-1">MINUTES</span>
        </div>

        <Separator />

        {/* Secondes */}
        <div className="flex flex-col items-center">
          <div className="flex">
            <DigitBox digit={formatTwoDigits(timeLeft.seconds)[0]} />
            <DigitBox digit={formatTwoDigits(timeLeft.seconds)[1]} />
          </div>
          <span className="text-[10px]  md:text-sm mt-1">SECONDES</span>
        </div>
      </div>
    </div>
  );
};

const DigitBox: React.FC<{ digit: string }> = ({ digit }) => (
  <div className="w-[30px] h-[30px]  lg:w-12 lg:h-16 bg-black bg-opacity-30 rounded-md flex items-center justify-center text-[14px]  sm:text-[16px] md:text-xl lg:text-2xl xl:text-3xl  font-bold mx-1">
    {digit}
  </div>
);

const Separator: React.FC = () => (
  <div className="flex items-center justify-center text-[14px]  sm:text-[16px] md:text-xl lg:text-2xl xl:text-3xl font-bold">
    :
  </div>
);

export default CountdownTimer;
