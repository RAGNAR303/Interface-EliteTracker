import { MinusSquareIcon, PlusSquareIcon } from "@phosphor-icons/react";
import { Header } from "../../components/header";
import style from "./style.module.css";
import { useRef } from "react";
export function Focus() {
  const focusInput = useRef<HTMLInputElement>(null);
  const restInput = useRef<HTMLInputElement>(null);

  function handleAddMinutes(type: "focus" | "rest") {
    if (type === "focus") {
      const currentValue = Number(focusInput.current?.value);
      if (focusInput.current?.value) {
        focusInput.current.value = String(currentValue + 5);
      }
      return;
    }

    const currentValue = Number(restInput.current?.value);
    if (restInput.current?.value) {
      restInput.current.value = String(currentValue + 5);
    }
  }

  function handleLowerMinutes(type: "focus" | "rest") {
    if (type === "focus") {
      const currentValue = Number(focusInput.current?.value);
      if (focusInput.current?.value) {
        focusInput.current.value = String(currentValue - 5);
      }
      return;
    }

    const currentValue = Number(restInput.current?.value);
    if (restInput.current?.value) {
      restInput.current.value = String(currentValue - 5);
    }
  }

  return (
    <div className={style.container}>
      <div className={style.content}>
        <Header title={"Tempo de foco"} />
        <div className={style["input-group"]}>
          <div className={style.input}>
            <PlusSquareIcon weight="bold" onClick={() => handleAddMinutes("focus")} />
            <input ref={focusInput} type="number" placeholder="Tempo de foco"  />
            <MinusSquareIcon weight="bold" onClick={() => handleLowerMinutes("rest")} />
          </div>
          <div className={style.input}>
            <PlusSquareIcon weight="bold" onClick={() => handleAddMinutes("rest")} />
            <input ref={restInput} type="number" placeholder="Tempo de descanso" />
            <MinusSquareIcon weight="bold" onClick={() => handleLowerMinutes("rest")} />
          </div>
        </div>
      </div>
    </div>
  );
}
