import style from "./style.module.css";

type infoProps = {
  value: string;
  label: string;
};

export function Info({ label, value }: infoProps) {
  return (
    <div className={style.container}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
