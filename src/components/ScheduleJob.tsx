import { useDispatch } from "react-redux";
import { JobInfoDTO } from "../data/JobInfoDTO";
import { validarExibirData } from "../App";
import { IonBadge, IonCol, IonLabel, IonRow, IonText } from "@ionic/react";

export interface ScheduleJobProps {
    job: JobInfoDTO, 
    indexId: string,
    par: boolean,
}

const ScheduleJob: React.FC<ScheduleJobProps> = ({ job, indexId, par }) => {
    const dispatch = useDispatch();
    //var color = ""; //job.checked ? "bg-warning" : "";

    //function handlerCheckJob() {
    //    const checked = job.checked ? false : true;
    //    dispatch(checkItemPilha({
    //        id: job.id, 
    //        checked: checked,
    //        ordem: ordem
    //    }));
    //}
    const cor = par ? "var(--ion-color-tertiary)" : "var(--ion-color-tertiary-shade)"
    const colunaCss = 'bg-transparent border border-1 px-2';

    return (
        <tr className={`font-monospace align-items-center align-middle small`} id={indexId} style={{backgroundColor: cor}}>
            {/*
            <IonCheckbox className="check-box" checked={job.checked} onClick={() => handlerCheckJob()}/>
            */}
            <td className='h-100 border border-start-0 align-items-center'  style={{backgroundColor: cor}}> 
                <IonRow className="border-end border-3 h-100 w-100 m-0 p-0 ion-justify-content-start ion-align-items-center">
                    <IonCol>
                    <IonBadge color="secondary" className="ms-2 h6">
                        ID {job.id}
                    </IonBadge>
                    <IonBadge color="#" className="text-white me-0 fw-bold h6">{job.nome}</IonBadge>
                    </IonCol>
                </IonRow> 
            </td>
            <td className={colunaCss}> {job.executarAposJob.join('\n')} </td>
            <td className={colunaCss}> {job.grupoConcorrencia} </td>
            <td className={colunaCss}> {job.fase} </td>
            <td className={colunaCss}> {job.descricao} </td>
            <td className={colunaCss}> {job.grupoUda} </td>
            <td className={colunaCss}> {job.programa.join('\n')} </td>
            <td className={colunaCss}> {job.tabelas.join('\n')} </td>
            <td className={colunaCss}> {job.servidor} </td>
            <td className={colunaCss}> {job.caminhoExec} </td>
            <td className={colunaCss}> {job.parametros.join('\n')} </td>
            <td className={colunaCss}> {job.descricaoParametros.join('\n')} </td>
            <td className={colunaCss}> {job.diretorioEntrada} </td>
            <td className={colunaCss}> {job.mascaraEntrada.join('\n')} </td>
            <td className={colunaCss}> {job.diretorioSaida} </td>
            <td className={colunaCss}> {job.mascaraSaida.join('\n')} </td>
            <td className={colunaCss}> {job.diretorioLog} </td>
            <td className={colunaCss}> {job.mascaraLog.join('\n')} </td>
            <td className={colunaCss}> {job.tratamento} </td>
            <td className={colunaCss}> {job.escalation} </td>
            <td className={colunaCss}> {validarExibirData(job.dataAtualizacao)} </td>
            <td className={colunaCss}> {job.atualizadoPor} </td>
        </tr>
    );
};

export default ScheduleJob;