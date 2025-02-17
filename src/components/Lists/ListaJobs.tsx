import { IonCardContent, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store/ReduxStore';
import { JobInfoDTO } from '../../data/JobInfoDTO';
import JobCard from '../Content/JobCard';
import { useEffect, useState } from 'react';

//Componente <ListaJobs>
const ListaJobs: React.FC = () => {

    //Estados gerenciados pelo Redux
    const catalogoJobs: JobInfoDTO[] = useSelector((state: RootState) => state.store.catalogoJobs.catalogo);
    const jobsSelecionados: number[] = useSelector((state: RootState) => state.store.configAtividade.jobSelecionado);
    const [jobs, setJobs] = useState<JobInfoDTO[]>(
        catalogoJobs.filter(
            (item) => jobsSelecionados.findIndex((id) => id === item.id) !== -1
        )
    );

    useEffect(() => {
        setJobs(catalogoJobs.filter(
            (item) => jobsSelecionados.findIndex((id) => id === item.id) !== -1
        ));
    }, [jobsSelecionados, catalogoJobs]);

    //Renderização do componente
    return (
        <IonRow className='container ion-justify-content-center'>
            <IonToolbar color='tertiary' className='glass w-100 m-3'>
                <IonTitle className='w-100'>Catálogo de Jobs</IonTitle>
            </IonToolbar>
            <IonCardContent className='w-100 h-100 mx-4 my-0 px-1 py-0'>
            {
                jobs.map((jobDto, index) => <JobCard key={index} jobDto={jobDto}/> )
            }
            </IonCardContent>
            <div className='m-3'></div>
        </IonRow>
    );
};

export default ListaJobs;

