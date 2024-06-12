interface Props {
    id: number,
    name: string;
    onRemovedItem: (id: number) => void;
}

function SelectedSymptom({ id, name, onRemovedItem }: Props) {
    return <>
    <button key={id} type="button" onClick={() => onRemovedItem(id)} className="btn btn-primary selected-symptom">
              {name} <span>&nbsp;</span><span className="close-icon"><span className="badge text-bg-secondary border border-light">X</span></span>
    </button>
    </>
}

export default SelectedSymptom;