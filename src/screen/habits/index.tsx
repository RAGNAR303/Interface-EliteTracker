import {
  CheckCircleIcon,
  NotePencilIcon,
  TrashSimpleIcon,
} from "@phosphor-icons/react";
import style from "./style.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../services/api";
import dayjs from "dayjs";
import { Header } from "../../components/header";
import { Info } from "../../components/info";
import { Calendar } from "@mantine/dates";
import clsx from "clsx";
import { Indicator } from "@mantine/core";

type Habit = {
  _id: string;
  name: string;
  completedDates: string[]; //array de datas
  userId: string;
  createdAt: string;
  updatedAt: string;
};

type HabitMetrics = {
  _id: string;
  name: string;
  completedDates: string[];
};

export function Habits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [metrics, setMetrics] = useState<HabitMetrics>({} as HabitMetrics);
  const [selectedHabit, setSelectHabit] = useState<Habit | null>(null);
  const createHabits = useRef<HTMLInputElement>(null);
  // pega o dias atual
  const today = dayjs().startOf("day");
  console.log({ today });
  // Faz o calculo dos dias que foram marcados como concluido .

  const metricsInfo = useMemo(() => {
    const numberOfMonthDays = today.endOf("month").get("date");
    const numberOfDays = metrics?.completedDates
      ? metrics?.completedDates?.length
      : 0;
    // Vai trazer o numero de dias concluidos , e comparar com dias que tem no mês exe: 10/31
    const completedDatesPerMonth = `${numberOfDays}/${numberOfMonthDays}`;
    // vai calcular porcetagem dos  dias que foram concluidos
    const completedDatesPercent = `${Math.round((numberOfDays / numberOfMonthDays) * 100)}%`;
    // Retorna para faro para ser usada
    return {
      completedDatesPerMonth,
      completedDatesPercent,
    };
  }, [metrics]);

  async function handleSelectHabits(habit: Habit, currentMonth?: Date) {
    setSelectHabit(habit);

    const { data } = await api.get<HabitMetrics>(
      `/habits/${habit._id}/metrics`,
      {
        params: {
          date: currentMonth
            ? currentMonth.toISOString()
            : today.startOf("month").toISOString(),
        },
      },
    );
    console.log({ data });
    setMetrics(data);
  }

  // Tras da API os lista de Habitos registrados
  async function loadHabits() {
    const { data } = await api.get<Habit[]>("/habits");

    setHabits(data);
  }

  //Cria os Habitos na API
  async function handleSubmit() {
    const newHabit = createHabits.current?.value;
    // Pega o valor do input , que e o Habitos criado
    if (newHabit) {
      await api.post("/habits", { name: newHabit });
      await loadHabits();
    }
    // Zera o valor do input depois.
    if (createHabits.current) {
      createHabits.current.value = "";
    }
  }
  // Marca e desmarcar com base no dias
  async function handleToggle(habit: Habit) {
    await api.patch(`/habits/${habit._id}/toggle`);
    await loadHabits();

    await handleSelectHabits(habit);
  }
  //  Deleta a habitos
  async function deleteHabits(id: string) {
    await api.delete(`/habits/${id}`);

    setMetrics({} as HabitMetrics);
    setSelectHabit(null);
    await loadHabits();
  }

  async function handleSelectMonth(date: string) {
    if (!selectedHabit) return;

    const parsedDate = dayjs(date).toDate();

    await handleSelectHabits(selectedHabit, parsedDate);
  }
  // rederiza o array de habitops que esta vindo do API
  useEffect(() => {
    loadHabits();
  }, []);

  return (
    <div className={style.container}>
      <div className={style.content}>
        <Header title={"Hábitos diários"} />
        <section>
          <div className={style.input}>
            <input
              type="text"
              ref={createHabits}
              placeholder="Digite aqui uma novo hábito..."
            />
            <NotePencilIcon onClick={handleSubmit} />
          </div>
          <div className={style.habits}>
            {habits.map((item) => (
              <div
                key={item._id}
                className={clsx(
                  style.habit,
                  item._id === selectedHabit?._id && style["habit-active"],
                )}
              >
                <p onClick={() => handleSelectHabits(item)}>{item.name}</p>
                <div className={style.action}>
                  <label>
                    <input
                      type="checkbox"
                      checked={item.completedDates.some(
                        (item) => item === today.toISOString(),
                      )}
                      onChange={() => handleToggle(item)}
                    />
                    <span className={style.check}>
                      <CheckCircleIcon
                        className={style.checked}
                        weight="fill"
                      />
                    </span>
                  </label>
                  <TrashSimpleIcon
                    onClick={() => deleteHabits(item._id)}
                    weight="duotone"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div>
        {selectedHabit && (
          <div className={style.metrics}>
            <h2>{selectedHabit.name} </h2>
            <div className={style["info-group"]}>
              <Info
                value={metricsInfo.completedDatesPerMonth}
                label={"Dias Concluidos"}
              />
              <Info
                value={metricsInfo.completedDatesPercent}
                label={"Porcentagem"}
              />
            </div>
            <div className={style["calender-container"]}>
              <Calendar
                className={style.calender}
                onMonthSelect={handleSelectMonth}
                onNextMonth={handleSelectMonth}
                onPreviousMonth={handleSelectMonth}
                static
                renderDay={(date) => {
                  const day = dayjs(date).date();
                  const isSameDate = metrics?.completedDates?.some((item) =>
                    dayjs(item).isSame(dayjs(date)),
                  );
                  const isToday = dayjs(date).isSame(dayjs(), "day");
                  return (
                    <Indicator
                      color="none"
                      disabled={!isSameDate}
                      className={clsx(
                        style.day,
                        isSameDate && style.incicator,
                        isToday && style.dayCurrent,
                      )}
                    >
                      <div>{day}</div>
                    </Indicator>
                  );
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
