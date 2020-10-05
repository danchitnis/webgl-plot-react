type prop = {
  id: string;
  d1: number;
  d2: number;
};

export default function InfoTable({ id, d1, d2 }: prop) {
  const st1 = {
    borderColor: "white",
    borderStyle: "solid",
    borderWidth: "1px",
  } as React.CSSProperties;

  return (
    <table style={{ borderCollapse: "collapse", borderSpacing: 0, width: "100%" }}>
      <thead>
        <tr>
          <th style={st1}>{`${id}1: ${d1.toExponential(2)}`}</th>
          <th style={st1}>{`${id}2: ${d2.toExponential(2)}`}</th>
          <th style={st1}>&Delta;{`${id}: ${(d2 - d1).toExponential(2)}`}</th>
        </tr>
      </thead>
    </table>
  );
}
