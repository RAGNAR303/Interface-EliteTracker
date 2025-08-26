import { CheckCircleIcon, NotePencilIcon, TrashSimpleIcon } from "@phosphor-icons/react";
import style from "./style.module.css";
import { SideBar } from "../../components/sidebar";
import { useEffect, useRef, useState } from "react";
import { api } from "../../services/api";

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
      loadHabits();
    }
    // Zera o valor do input depois.
    if (createHabits.current) {
      createHabits.current.value = "";
    }
  }

  // async function deleteHabits(id) {
  //   await api.delete(`/habits/${id}`);
  // }

  return (
    <div className={style.screen}>
      <div>
        <SideBar />
      </div>
      <div className={style.container}>
        <div className={style.content}>
          <header>
            <h1>Hábitos diários</h1>
            <span>{`HOJE , ${new Intl.DateTimeFormat("pt-BR", {
              dateStyle: "full",
              timeZone: "America/Sao_Paulo",
            })
              .format(new Date())
              .toLocaleUpperCase()}`}</span>
          </header>
          <section>
            <div className={style.input}>
              <input
                type="text"
                ref={createHabits}
                placeholder="Digite aqui uma nova atividade..."
              />
              <NotePencilIcon onClick={handleSubmit} />
            </div>
            <div className={style.habits}>
              {habits.map((item) => (
                <div key={item._id} className={style.habit}>
                  <p>{item.name}</p>
                  <div className={style.action}>
                    <label>
                      <input type="checkbox" />
                      <span className={style.check}>
                        <CheckCircleIcon className={style.checked} weight="fill" />
                      </span>
                    </label>
                    <TrashSimpleIcon
                      id={item._id}
                      // onClick={() => deleteHabits(id)}
                      weight="duotone"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
