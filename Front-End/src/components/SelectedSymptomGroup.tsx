import SelectedSymptom from './SelectedSymptom';

interface Props {
    symptoms: {
        id: number;
        symptom: string;
    }[];
    onDeletedItem: (id: number) => void;
}

const SelectedSymptomGroup = ({symptoms, onDeletedItem}: Props) => {
    const handleDeletedItem = (id: number) => {
        onDeletedItem(id);
    };

    return (
        <div className="symptom-group">
            {symptoms.map(symptom => (
                <SelectedSymptom onRemovedItem={handleDeletedItem} key={symptom.id} id={symptom.id} name={symptom.symptom} />
            ))}
        </div>
    );
};

export default SelectedSymptomGroup;



