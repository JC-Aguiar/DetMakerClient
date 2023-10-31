import { combineReducers } from "@reduxjs/toolkit";
import tabMenu from './Reducer/ReducerTabMenu';
import pilhaJobs from './Reducer/ReducerPilhaJobs';
import carregarJobs from "./Reducer/ReducerCarregarJobs";
import escolherJobs from "./Reducer/ReducerEscolherJobs";
import configurarJobs from "./Reducer/ReducerConfigurarJobs";
import evidenciaJobs from "./Reducer/ReducerEvidenciaJobs";
import configPipelines  from './Reducer/ReducerPipelines';
import configAtividade from './Reducer/ReducerPipelineExecute';

const rootReducer = combineReducers({
    pilhaJobs: pilhaJobs,
    tabMenu: tabMenu,
    carregarJobs: carregarJobs,
    escolherJobs: escolherJobs,
    configurarJobs: configurarJobs,
    evidenciaJobs: evidenciaJobs,
    configPipelines: configPipelines,
    configAtividade: configAtividade,
});
  
export default rootReducer;