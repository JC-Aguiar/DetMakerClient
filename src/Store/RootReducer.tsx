import { combineReducers } from "@reduxjs/toolkit";
//import agendas from './Reducer/ReducerAgendas';
import pilhaJobs from './Reducer/ReducerPilhaJobs';
import abrirSchedule from "./Reducer/ReducerAbrirSchedule";
import escolherJobs from "./Reducer/ReducerEscolherJobs";
import configurarJobs from "./Reducer/ReducerConfigurarJobs";

const rootReducer = combineReducers({
    //agendas: agendas,
    pilhaJobs: pilhaJobs,
    abrirShedule: abrirSchedule,
    escolherJobs: escolherJobs,
    configurarJobs: configurarJobs,
});
  
export default rootReducer;