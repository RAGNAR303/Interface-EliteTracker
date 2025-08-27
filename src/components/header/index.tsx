import style from "./style.module.css";

type headerProps = {
  title: string;
};

export function Header({ title }: headerProps) {
  return (
    <header className={style.container}>
      <h1>{title}</h1>
      <span>{`HOJE , ${new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "full",
        timeZone: "America/Sao_Paulo",
      })
        .format(new Date())
        .toLocaleUpperCase()}`}</span>
    </header>
  );
}
