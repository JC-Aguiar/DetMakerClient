import { combineReducers } from "@reduxjs/toolkit";
//import agendas from './Reducer/ReducerAgendas';
import pilhaJobs from './Reducer/ReducerPilhaJobs';
import carregarJobs from "./Reducer/ReducerCarregarJobs";
import escolherJobs from "./Reducer/ReducerEscolherJobs";
import configurarJobs from "./Reducer/ReducerConfigurarJobs";
import evidenciaJobs from "./Reducer/ReducerEvidenciaJobs";

const rootReducer = combineReducers({
    pilhaJobs: pilhaJobs,
    carregarJobs: carregarJobs,
    escolherJobs: escolherJobs,
    configurarJobs: configurarJobs,
    evidenciaJobs: evidenciaJobs,
});
  
export default rootReducer;