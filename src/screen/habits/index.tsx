import { CheckCircleIcon, NotePencilIcon, TrashSimpleIcon } from "@phosphor-icons/react";
import style from "./style.module.css";
import { useEffect, useRef, useState } from "react";
import { api } from "../../services/api";
import dayjs from "dayjs";
import { Header } from "../../components/header";

type Habits = {
  _id: string;
  name: string;
  completedDates: string[]; //array de datas
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export function Habits() {
  const [habits, setHabits] = useState<Habits[]>([]);
  const createHabits = useRef<HTMLInputElement>(null);

  // pega o dias atual
  const today = dayjs().startOf("day").toISOString();

  async function loadHabits() {
    const { data } = await api.get<Habits[]>("/habits");

    setHabits(data);
  }
  // rederiza o array de habitops que esta vindo do API
  useEffect(() => {
    loadHabits();
  }, []);

  //Cria os Habitos na API
  async function handleSubmit() {
    const addhabit = createHabits.current?.value;
    // Pega o valor do input , que e o Habitos criado
    if (addhabit) {
      await api.post("/habits", { name: addhabit });
      await loadHabits();
    }
    // Zera o valor do input depois.
    if (createHabits.current) {
      createHabits.current.value = "";
    }
  }
  // Marca e desmarcar com base no dias
  async function handleToggle(id: string) {
    await api.patch(`/habits/${id}/toggle`);
    await loadHabits();
  }
  //  Deleta a habitos
  async function deleteHabits(id: string) {
    await api.delete(`/habits/${id}`);
    await loadHabits();
  }

  return (
    <div className={style.container}>
      <div className={style.content}>
        <Header title={"Hábitos diários"} />
        <section>
          <div className={style.input}>
            <input type="text" ref={createHabits} placeholder="Digite aqui uma nova hábito..." />
            <NotePencilIcon onClick={handleSubmit} />
          </div>
          <div className={style.habits}>
            {habits.map((item) => (
              <div key={item._id} className={style.habit}>
                <p>{item.name}</p>
                <div className={style.action}>
                  <label>
                    <input
                      type="checkbox"
                      checked={item.completedDates.some((item) => item === today)}
                      onChange={() => handleToggle(item._id)}
                    />
                    <span className={style.check}>
                      <CheckCircleIcon className={style.checked} weight="fill" />
                    </span>
                  </label>
                  <TrashSimpleIcon onClick={() => deleteHabits(item._id)} weight="duotone" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
