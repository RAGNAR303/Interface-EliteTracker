import { NotePencilIcon, TrashSimpleIcon } from "@phosphor-icons/react";
import style from "./style.module.css";
import { SideBar } from "../../components/sidebar";

export function Habits() {
  return (
    <div className={style.screen}>
      <div>
        <SideBar />
      </div>
      <div className={style.container}>
        <div className={style.content}>
          <header>
            <h1>Hábitos diários</h1>
            <span>Hoje, 23 de setembro 2025</span>
          </header>
          <section>
            <div className={style.input}>
              <input type="text" placeholder="Digite aqui uma nova atividade..." />
              <NotePencilIcon />
            </div>
            <div className={style.habits}>
              {Array(20)
                .fill(1)
                .map((_, index) => (
                  <div key={index} className={style.habit}>
                    <p>Estudar Programação</p>
                    <div className={style.action}>
                      <input type="checkbox" name="" id="" />
                      <TrashSimpleIcon />
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
