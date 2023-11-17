import { IonCheckbox, useIonViewDidEnter } from "@ionic/react";
import { useDispatch } from "react-redux";
import { validarExibirData } from "../pages/CarregarJobs";
import { JobInfoDTO } from "../data/JobInfoDTO";
import { checkItemPilha } from "../Store/Reducer/ReducerPilhaJobs";

export interface JobScheduleProps {
    job: JobInfoDTO, 
    indexId: string,
    ordem: number,
}

const JobSchedule: React.FC<JobScheduleProps> = ({ job, indexId, ordem }) => {
    const dispatch = useDispatch();
    var color = job.checked ? "bg-warning" : "";

    function handlerCheckJob() {
        const checked = job.checked ? false : true;
        dispatch(checkItemPilha({
            id: job.id, 
            checked: checked,
            ordem: ordem
        }));
    }

    useIonViewDidEnter(() => {
        console.debug(`[JOB-SCHEDULE] job: ${job}, indexId: ${indexId}.`);
    }, []);

    return (
        <tr className={`font-monospace ${color} align-items-center align-middle`} id={indexId}>
            <td>
                <IonCheckbox
                    className="check-box"
                    checked={job.checked}
                    onClick={() => handlerCheckJob()}
                />
            </td>
            <td className='bg-transparent border border-1'> {job.id} </td>
            <td className='bg-transparent border border-1'> {job.executarAposJob.join(", ")} </td>
            <td className='bg-transparent border border-1'> {job.grupoConcorrencia} </td>
            <td className='bg-transparent border border-1'> {job.fase} </td>
            <td className='bg-transparent border border-1'> {job.nome} </td>
            <td className='bg-transparent border border-1'> {job.descricao} </td>
            <td className='bg-transparent border border-1'> {job.grupoUda} </td>
            <td className='bg-transparent border border-1'> {job.programa.join(", ")} </td>
            <td className='bg-transparent border border-1'> {job.tabelas.join(", ")} </td>
            <td className='bg-transparent border border-1'> {job.servidor} </td>
            <td className='bg-transparent border border-1'> {job.caminhoExec} </td>
            <td className='bg-transparent border border-1'> {job.parametros.join(", ")} </td>
            <td className='bg-transparent border border-1'> {job.descricaoParametros.join(", ")} </td>
            <td className='bg-transparent border border-1'> {job.diretorioEntrada} </td>
            <td className='bg-transparent border border-1'> {job.mascaraEntrada.join(", ")} </td>
            <td className='bg-transparent border border-1'> {job.diretorioSaida} </td>
            <td className='bg-transparent border border-1'> {job.mascaraSaida.join(", ")} </td>
            <td className='bg-transparent border border-1'> {job.diretorioLog} </td>
            <td className='bg-transparent border border-1'> {job.mascaraLog.join(", ")} </td>
            <td className='bg-transparent border border-1'> {job.tratamento} </td>
            <td className='bg-transparent border border-1'> {job.escalation} </td>
            <td className='bg-transparent border border-1'> {validarExibirData(job.dataAtualizacao)} </td>
            <td className='bg-transparent border border-1'> {job.atualizadoPor} </td>
        </tr>
    );
};

export default JobSchedule;