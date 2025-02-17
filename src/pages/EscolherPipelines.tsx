import { RootState } from '../Store/ReduxStore';
import { useDispatch, useSelector } from 'react-redux';
import ModalPipelineRunner from '../components/Modals/ModalPipelineRunner';
import { JobInfoDTO } from '../data/JobInfoDTO';
import Informativo from '../components/Core/Informativo';
import Carregando from '../components/Core/Carregando';
import JobCard from '../components/Content/JobCard';

//Componente <EscolherPipelines>
const EscolherPipelines: React.FC = () => {
    //Atrbiutos Redux e React
    //const dispatch = useDispatch();
    
    //Atributos com estado gerenciado via Redux
    const isLoadingJobs = useSelector((state: RootState) => state.store.catalogoJobs.loading);
    const isLoadingPipelines = useSelector(
        (state: RootState) => state.store.catalogoPipelines.loading
    );
    const catalogoJobs: JobInfoDTO[] = useSelector(
        (state: RootState) => state.store.catalogoJobs.catalogo
    );
    const jobIdSelecionado: number = useSelector(
        (state: RootState) => state.store.configAtividade.jobSelecionado
    );
    const jobSelecionado: JobInfoDTO | undefined = useSelector(
        (state: RootState) => state.store.catalogoJobs.catalogo.find(job => job.id === jobIdSelecionado)
    );
    const mainPipeline: string = useSelector(
        (state: RootState) => state.store.configAtividade.mainPipeline
    );

    //Atributos de utilidade
    const isLoading = isLoadingJobs || isLoadingPipelines;

    //Ações ao carregar esta página
    /*
    useEffect(() => {
    useIonViewWillEnter(() => {
        coletarRecursos();
    }, [mainClienteId, mainCliente]);
    */

    //Conteúdo principal caso existam dados na base
    function conteudo() {
        if (jobSelecionado) return <JobCard jobDto={jobSelecionado} retratil={false}/>;
        if (mainPipeline !== "") return <ModalPipelineRunner/>;
        
        const mensagem = 'Use o painel lateral para vizualizar {Jobs} e {Pipelines}\n'
            + 'Selecione um {Job}, fora da {Pipeline}, para analisá-lo\n'
            + 'Selecione uma {Pipeline} para inserir {Jobs} ou configurar sua execução';
        return <Informativo mensagem={mensagem} status='Normal' />;
    }

    //Renderização visual deste componente
    if (isLoading) return <Carregando />;
    if (catalogoJobs.length < 1) {
        return <Informativo 
                    mensagem='Uma alternativa é fazer o upload da planilha de Jobs, usando o botão {Nova Schedule}' 
                    status='SemDados'
                />;
    }
    return (
        <div className='p-0 m-0'> 
            {conteudo()}
        </div>
    );
};

export default EscolherPipelines;

