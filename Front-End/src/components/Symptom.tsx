import { MouseEvent } from "react";

interface Props {
    id: number;
    name: string;
    onSelectItem: (id: number, name: string) => void;
}

function Symptom({ id, name, onSelectItem }: Props) {
    return <button key={id} onClick={() => onSelectItem(id, name)} type="button" className="btn btn-light symptom-card">
              {name}
    </button>
}

export default Symptom;