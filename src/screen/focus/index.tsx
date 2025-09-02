import {
  MinusSquareIcon,
  PlusSquareIcon,
  TimerIcon,
} from "@phosphor-icons/react";
import { Header } from "../../components/header";
import style from "./style.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../components/button";
import { useTimer } from "react-timer-hook";
import dayjs from "dayjs";
import { api } from "../../services/api";
import { Info } from "../../components/info";
import { Calendar } from "@mantine/dates";
import { Indicator } from "@mantine/core";
import clsx from "clsx";

type Timers = {
  focus: number;
  rest: number;
};

type FocusMetrics = {
  _id: [number, number, number];
  count: number;
};

type FocusTime = {
  _id: string;
  timeFrom: string;
  timeTo: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

const TimerState = {
  PAUSED: "PAUSED",
  FOCUS: "FOCUS",
  REST: "REST",
} as const;

export type TimerState = (typeof TimerState)[keyof typeof TimerState];

const timerStateTitle = {
  [TimerState.PAUSED]: "PAUSADO",
  [TimerState.FOCUS]: "EM FOCO",
  [TimerState.REST]: "EM DESCANSO",
};

export function Focus() {
  const focusInput = useRef<HTMLInputElement>(null);
  const restInput = useRef<HTMLInputElement>(null);
  const [timers, setTimers] = useState<Timers>({ focus: 0, rest: 0 });
  const [timerState, setTimerState] = useState<TimerState>(TimerState.PAUSED);
  const [timeFrom, setTimeFrom] = useState<Date | null>(null);
  const [historical, setHistorical] = useState<FocusTime[]>([]);
  const [focusMetrics, setFocusMetrics] = useState<FocusMetrics[]>([]);
  const [focusTimes, setFocusTimes] = useState<FocusTime[]>([]);
  const [currentMonth, setCurrentMonth] = useState<dayjs.Dayjs>(
    dayjs().startOf("month"),
  );
  // recebe dias "setCurrentDate"  e manda "currentDate" que esta tipado para receber no formado de dia.
  const [currentDate, setCurrentDate] = useState<dayjs.Dayjs>(
    dayjs().startOf("day"),
  );

  function addSeconds(date: Date, seconds: number) {
    const time = dayjs(date).add(seconds, "seconds");

    return time.toDate();
  }

  function handlerStart() {
    restTimer.pause();
    const now = new Date();

    focusTimer.restart(addSeconds(now, timers.focus * 60));

    setTimeFrom(now);
  }

  async function handleEnd() {
    focusTimer.pause();
    await api.post("/focus-time", {
      timeFrom: timeFrom?.toISOString(),
      timeTo: new Date().toISOString(),
    });

    setTimeFrom(null);
  }
  // Contador tempo de foco
  const focusTimer = useTimer({
    expiryTimestamp: new Date(),
    async onExpire() {
      if (timerState !== TimerState.PAUSED) {
        await handleEnd();
      }
    },
  });
  // Contador tempo de descanso
  const restTimer = useTimer({
    expiryTimestamp: new Date(),
  });

  // Adciona minutos nos Inputs
  function handleAddMinutes(type: "focus" | "rest") {
    if (type === "focus") {
      const currentValue = Number(focusInput.current?.value);

      if (focusInput.current) {
        const value = currentValue + 5; // padrão valor acrecenta 5min
        focusInput.current.value = String(value);
        setTimers((old) => ({
          ...old,
          focus: value,
        }));
      }
      return;
    }

    const currentValue = Number(restInput.current?.value);
    if (restInput.current) {
      const value = currentValue + 5;

      restInput.current.value = String(value);
      setTimers((old) => ({
        ...old,
        rest: value,
      }));
    }
  }
  // Diminui minutos no input
  function handleMinusMinutes(type: "focus" | "rest") {
    if (type === "focus") {
      const currentValue = Number(focusInput.current?.value);

      if (focusInput.current) {
        const value = currentValue <= 0 ? 0 : currentValue - 5; // padrão valor acrecenta 5min
        focusInput.current.value = String(value);
        setTimers((old) => ({
          ...old,
          focus: value,
        }));
      }
      return;
    }

    const currentValue = Number(restInput.current?.value);
    if (restInput.current) {
      const value = currentValue <= 0 ? 0 : currentValue - 5;

      restInput.current.value = String(value);
      setTimers((old) => ({
        ...old,
        rest: value,
      }));
    }
  }

  // Cancela contagem e Zera os inputs , e o botão de" começar" fica desabilitado
  function handleCancel() {
    setTimers({
      focus: 0,
      rest: 0,
    });

    setTimerState(TimerState.PAUSED);

    if (focusInput.current?.value) {
      focusInput.current.value = "";
    }
    if (restInput.current?.value) {
      restInput.current.value = "";
    }
  }

  function handleFocus() {
    if (timers.focus <= 0 || timers.rest <= 0) {
      return;
    }
    handlerStart();
    setTimerState(TimerState.FOCUS);
  }

  async function handleRest() {
    await handleEnd();

    const now = new Date();

    restTimer.restart(addSeconds(now, timers.rest * 60));
    setTimerState(TimerState.REST);
  }

  function handleResume() {
    handlerStart();

    setTimerState(TimerState.FOCUS);
  }

  async function loadFocusMetrics(currentMonth: string) {
    const { data } = await api.get<FocusMetrics[]>("/focus-time/metrics", {
      params: {
        date: currentMonth,
      },
    });
    console.log(data);

    setFocusMetrics(data);
  }
  async function loadFocusTimes(currentDate: string) {
    const { data } = await api.get<FocusTime[]>("/focus-time", {
      params: {
        date: currentDate,
      },
    });
    console.log({ data });
    setFocusTimes(data);
  }
  console.log({ focusTimes });

  // async function handleTimerHistorical(date: string) {
  //   console.log({ date });
  //   const { data } = await api.get<FocusTime[]>("/focus-time", {
  //     params: {
  //       date,
  //     },
  //   });
  //   setHistorical(data);
  //   console.log({ data });
  // }
  // console.log({ historical });
  // const historicalInfo = useMemo(() => {
  //   const from = historical.timeFrom

  // }, [historical]);

  

  //Calcula a quantidade de minutos que foi acumulado  no tempo de foco

  const metricsInfoByDay = useMemo(() => {
    const timesMetric = focusTimes.map((item) => ({
      timeFrom: dayjs(item.timeFrom),
      timeTo: dayjs(item.timeTo),
    }));

    let totalTimeInMinutes = 0;

    if (timesMetric.length) {
      for (const { timeFrom, timeTo } of timesMetric) {
        const diff = timeTo.diff(timeFrom, "minutes");

        totalTimeInMinutes += diff;
        console.log(diff);
      }
    }

    return {
      timesMetric,
      totalTimeInMinutes,
    };
  }, [focusTimes]);

  const metricsInfoByMonth = useMemo(() => {
    const completedDates: string[] = [];
    let counter: number = 0;

    if (focusMetrics.length) {
      focusMetrics.forEach((item) => {
        const date = dayjs(`${item._id[0]}-${item._id[1]}-${item._id[2]}`)
          .startOf("day")
          .toISOString();

        completedDates.push(date);
        counter += item.count;
      });
    }

    return { completedDates, counter };
  }, [focusMetrics]);

  async function handleSelectMonth(date: string) {
    setCurrentMonth(dayjs(date));
    setCurrentDate(dayjs(date));
  }

  // Recebe o dias selecionado no calendario e manda para useState "setCurrentDate"
  async function handleSelectDay(date: string) {
    setCurrentDate(dayjs(date));
  }

  useEffect(() => {
    loadFocusMetrics(currentMonth.toISOString());
  }, [currentMonth]);

  useEffect(() => {
    loadFocusTimes(currentDate.toISOString());
  }, [currentDate]);

  return (
    <div className={style.container}>
      <div className={style.content}>
        <Header title={"Tempo de foco"} />
        <div className={style["input-group"]}>
          <div className={style.input}>
            <PlusSquareIcon
              weight="bold"
              onClick={() => handleAddMinutes("focus")}
            />
            <input
              ref={focusInput}
              type="number"
              placeholder="Tempo de foco"
              disabled
            />
            <MinusSquareIcon
              weight="bold"
              onClick={() => handleMinusMinutes("focus")}
            />
          </div>
          <div className={style.input}>
            <PlusSquareIcon
              weight="bold"
              onClick={() => handleAddMinutes("rest")}
            />
            <input
              ref={restInput}
              type="number"
              placeholder="Tempo de descanso"
              disabled
            />
            <MinusSquareIcon
              weight="bold"
              onClick={() => handleMinusMinutes("rest")}
            />
          </div>
        </div>
        <div className={style.timer}>
          <div className={style.circle}>
            <strong>{timerStateTitle[timerState]}</strong>
            {timerState === TimerState.PAUSED && (
              <span>
                {`${String(timers.focus).padStart(2, "0")}`}
                <p>:</p>00
              </span>
            )}
            {timerState === TimerState.FOCUS && (
              <span>
                {`${String(focusTimer.minutes).padStart(2, "0")}`}
                <p>:</p>
                {`${String(focusTimer.seconds).padStart(2, "0")} `}
              </span>
            )}
            {timerState === TimerState.REST && (
              <span>
                {`${String(restTimer.minutes).padStart(2, "0")}`}
                <p>:</p>
                {`${String(restTimer.seconds).padStart(2, "0")} `}
              </span>
            )}
          </div>
        </div>

        <div className={style["button-group"]}>
          {timerState === TimerState.PAUSED && (
            <Button
              onClick={handleFocus}
              disabled={timers.focus <= 0 || timers.rest <= 0}
            >
              Começar
            </Button>
          )}
          {timerState === TimerState.FOCUS && (
            <Button onClick={handleRest}>Iniciar Descanso</Button>
          )}
          {timerState === TimerState.REST && (
            <Button onClick={handleResume}>Retomar</Button>
          )}

          <Button onClick={handleCancel} variant={"error"}>
            Cancelar
          </Button>
        </div>
      </div>
      <div>
        <div className={style.metrics}>
          <h2>Estátisticas</h2>
          <div className={style["info-group"]}>
            <Info
              value={String(metricsInfoByMonth.counter)}
              label={"Ciclos Totais"}
            />
            <Info
              value={`${metricsInfoByDay.totalTimeInMinutes} min`}
              label={"Tempo total de foco"}
            />
          </div>
          {/* <div className={style["content-Timer"]}>
            <h4>{}</h4>
            <div className={style.timeday}>
              {Array(6)
                .fill(1)
                .map((_, index) => (
                  <div className={style.timercalander}>
                    <div key={index}>
                      <TimerIcon />
                      <p>13:00 - 13:30</p>
                    </div>
                    <p>{index}25 minutos</p>
                  </div>
                ))}
            </div>
          </div> */}
          <div className={style["calender-container"]}>
            <Calendar
              getDayProps={(date) => ({
                selected: dayjs(date).isSame(currentDate), // Função que reconhece o click no mause nos dias
                onClick: () => handleSelectDay(date), // Manda para "handleSelectDay" a data clicada.
              })}
              onMonthSelect={handleSelectMonth}
              onNextMonth={handleSelectMonth}
              onPreviousMonth={handleSelectMonth}
              className={style.calender}
              renderDay={(date) => {
                const day = dayjs(date).date();
                const isSameDate = metricsInfoByMonth.completedDates.some(
                  (item) => dayjs(item).isSame(dayjs(date)),
                );
                return (
                  <Indicator
                    color="none"
                    disabled={!isSameDate}
                    className={clsx(style.day, isSameDate && style.incicator)}
                  >
                    <div>{day}</div>
                  </Indicator>
                );
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
