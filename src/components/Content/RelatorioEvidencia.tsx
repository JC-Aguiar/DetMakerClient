import { offsetDateTimeParaString } from "../../App";
import { EvidenciaInfoDTO, checkEvidenciaPronta } from "../../data/EvidenciaInfoDTO";

export interface RelatorioEvidenciaProps {
    evidencia: EvidenciaInfoDTO,
    evIndex: number,
    lock: boolean,
}

const RelatorioEvidencia: React.FC<RelatorioEvidenciaProps> = ({ evidencia, evIndex, lock }) => {

    const evidenciaId = evidencia.id;
    const nome = evidencia.job;
    const descricao = evidencia.jobDescricao;
    const sha256 = evidencia.sha256;
    const exitCode = evidencia.exitCode;
    const erroFatal = evidencia.erroFatal;
    const comentario = evidencia.comentario;
    const resultado = evidencia.resultado;
    const parametros = evidencia.argumentos;
    const revisor = evidencia.revisor;
    const data = offsetDateTimeParaString(evidencia.dataFim);
    const queries = evidencia.queries;
    const tabelasNome = evidencia.queriesNome;
    const tabelasPreJob = evidencia.tabelasPreJob;
    const tabelasPosJob = evidencia.tabelasPosJob;
    const queriesInconformidade = evidencia.queriesInconformidade;
    const anexosTotais: JSX.Element[] = [];
    const pronto = checkEvidenciaPronta(evidencia);
    //const lock = IdsLocked.findIndex((item) => item === evidencia.id) !== -1;

    const logsConteudo: string[] = [];
    const logsNome: string[] = [];
    const cargasConteudo: string[] = [];
    const cargasNome: string[] = [];
    const saidasConteudo: string[] = [];
    const saidasNome: string[] = [];
    const anexosInconformidade: string[] = [];

    evidencia.logs.forEach((anexo) => {
        logsConteudo.push(anexo.conteudo);
        logsNome.push(anexo.nome);
        if (anexo.inconformidade)
            anexosInconformidade.push(anexo.inconformidade);
    });
    evidencia.cargas.forEach((anexo) => {
        cargasConteudo.push(anexo.conteudo);
        cargasNome.push(anexo.nome);
        if (anexo.inconformidade)
            anexosInconformidade.push(anexo.inconformidade);
    });
    evidencia.saidas.forEach((anexo) => {
        saidasConteudo.push(anexo.conteudo);
        saidasNome.push(anexo.nome);
        if (anexo.inconformidade)
            anexosInconformidade.push(anexo.inconformidade);
    });

    //Preenchendo anexos de tabelas por query
    queries.forEach((query, index) => {
        const nomePreJob = `Tabela ${tabelasNome[index]} antes` + '\n';
        const nomePosJob = `Tabela ${tabelasNome[index]} depois` + '\n';
        const bancoInfo = <div>
            <h5 className='fw-bold mt-3'>{tabelasNome[index]}</h5>
            <p className='my-0 px-2 py-0 small font-monospace bg-light'>{query + '\n'}</p>
            <div id='list-group-item'
                className='btn btn-outline-primary py-0 px-1 me-2'
                onClick={() => abrirAnexo(nomePreJob, tabelasPreJob[index])}
            >
                {nomePreJob}
            </div>
            <div id='list-group-item'
                className='btn btn-outline-primary py-0 px-1 me-2'
                onClick={() => abrirAnexo(nomePosJob, tabelasPosJob[index])}
            >
                {nomePosJob}
            </div>
        </div>;
        anexosTotais.push(bancoInfo);
    });
    //Preenchendo anexos de logs
    logsNome.forEach((nome, index) => {
        const sessao = (index === 0) ? (<h5 className='fw-bold mt-3'>LOGS</h5>) : (null);
        const logInfo = <div>
            {sessao}
            <div id='list-group-item'
                className='btn btn-outline-primary py-0 px-1 me-2 '
                onClick={() => abrirAnexo(nome, logsConteudo[index])}
            >
                {nome + "\n"}
            </div>
        </div>
        anexosTotais.push(logInfo);
    });
    //Preenchendo anexos de cargas
    cargasNome.forEach((nome, index) => {
        const sessao = (index === 0) ? (<h5 className='fw-bold mt-3'>CARGAS</h5>) : (null);
        const cargaInfo = <div>
            {sessao}
            <div id='list-group-item'
                className='btn btn-outline-primary py-0 px-1 me-2'
                onClick={() => abrirAnexo(nome, cargasConteudo[index])}
            >
                {nome + "\n"}
            </div>
        </div>
        anexosTotais.push(cargaInfo);
    })
    //Preenchendo anexos de saídas
    saidasNome.forEach((nome, index) => {
        const sessao = (index === 0) ? (<h5 className='fw-bold mt-3'>SAÍDAS</h5>) : (null);
        const saidaInfo = <div>
            {sessao}
            <div id='list-group-item'
                className='btn btn-outline-primary py-0 px-1 me-2'
                onClick={() => abrirAnexo(nome, saidasConteudo[index])}
            >
                {nome + "\n"}
            </div>
        </div>
        anexosTotais.push(saidaInfo);
    });

    const setResultado = (e: CustomEvent<RadioGroupChangeEventDetail<any>>) => {
        const revisao = {
            index: evIndex,
            resultado: e.detail.value,
            revisor: user.name,
        }
        dispatch(setTestcaseResultado(revisao));
    };

    const setComentario = (e: CustomEvent<TextareaChangeEventDetail>) => {
        if (!e.detail.value) return;
        setTestcaseExpectativa({ index: evIndex, valor: e.detail.value })
    };

    return (
        <div className='table-responsive' key={evIndex}>
            <IonGrid className='ion-align-items-center pt-3 pb-0'>
                <IonRow>
                    {iconCampoObrigatorio(pronto ? "sim" : "")}
                    <span id={`${evidenciaId}`} className='h3'>{nome}</span>
                </IonRow>
            </IonGrid>
            <table className='table table-light table-striped m-0 mb-5 text-start'>
                <tbody>
                    <tr>
                        <th>Evidência ID</th>
                        <td>EVIDÊNCIA ID {evidenciaId}</td>
                    </tr>
                    <tr>
                        <th>Descrição do Job</th>
                        <td>{descricao}</td>
                    </tr>
                    <tr>
                        <th>Parâmetros do Job</th>
                        <td>{parametros}</td>
                    </tr>
                    <tr>
                        <th>SHA256</th>
                        <td>{sha256}</td>
                    </tr>
                    <tr>
                        <th>Data do Teste</th>
                        <td>{data}</td>
                    </tr>
                    <tr>
                        <th>Código de Saída</th>
                        <td>{exitCode}</td>
                    </tr>
                    <tr>
                        <th>Erro Fatal</th>
                        <td>{erroFatal}</td>
                    </tr>
                    <tr>
                        <th>Inconformidades</th>
                        <td className='font-monospace'>
                            <div style={{ width: "100%", maxWidth: "950px", whiteSpace: "nowrap", overflowX: 'scroll' }}>
                                {
                                    queriesInconformidade.map(linha => <div> - {linha}</div>)
                                }
                                {
                                    anexosInconformidade.map(linha => <div> - {linha}</div>)
                                }
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <IonGrid>
                                <IonRow className='ion-align-items-center'>
                                    <IonCol className='p-0 m-0'>Resultado Obtido</IonCol>
                                    <IonCol className='p-0 m-0' size='auto'>
                                        {iconCampoObrigatorio(resultado)}
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </th>
                        <td>
                            <IonRadioGroup value={resultado} onIonChange={setResultado} >
                                <div className='d-flex justify-items-center'>
                                    {
                                        resultadoStatus.map((item, index) => {
                                            return (
                                                <IonItem key={index}
                                                    lines='none'
                                                    disabled={lock}
                                                    className='bg-info bg-opacity-25 rounded rounded-4 m-1 my-2'
                                                >
                                                    <IonLabel color='primary' className='p-0 m-0'>{item}</IonLabel>
                                                    <IonRadio color='primary' className='p-0 m-1' slot="start" value={item} />
                                                </IonItem>
                                            );
                                        })
                                    }
                                </div>
                            </IonRadioGroup>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <IonGrid>
                                <IonRow className='ion-align-items-center'>
                                    <IonCol className='p-0 m-0'>Revisor</IonCol>
                                    <IonCol className='p-0 m-0' size='auto'>{iconCampoObrigatorio(revisor)}</IonCol>
                                </IonRow>
                            </IonGrid>
                        </th>
                        <td className='align-middle'>
                            <span className='text-primary h6'>{revisor}</span>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <IonGrid>
                                <IonRow className='ion-align-items-center'>
                                    <IonCol className='p-0 m-0'>Notas do Revisor</IonCol>
                                    <IonCol className='p-0 m-0' size='auto'>{iconCampoFacultativo(comentario)}</IonCol>
                                </IonRow>
                            </IonGrid>
                        </th>
                        <td>
                            <IonTextarea inputmode='text'
                                maxlength={280}
                                className='text-dark bg-white bg-opacity-50 ps-2 mb-2 rounded rounded-3 border'
                                value={comentario}
                                disabled={lock}
                                onIonChange={setComentario}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>Anexos de Evidência</th>
                        <td>{anexosTotais}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
})

return (
    <></>
);

}

export default RelatorioEvidencia;