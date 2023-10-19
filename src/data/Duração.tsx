class Duração {
    private horas: number;
    private minutos: number;
    private segundos: number;
    private milisegundos: number;

    constructor(
        horas: number,
        minutos: number,
        segundos: number,
        milisegundos: number
    ) {
        this.horas = horas;
        this.minutos = minutos;
        this.segundos = segundos;
        this.milisegundos = milisegundos;
    }

    checkMinutos() {
        if (this.minutos >= 60) {
            let diferença = Math.floor(this.minutos / 60);
            this.horas += diferença;
        }
    }

    checkSegundos() {
        if (this.segundos >= 60) {
            let diferença = Math.floor(this.segundos / 60);
            this.segundos += diferença;
        }
    }

    checkMilisegundos() {
        if (this.milisegundos >= 1000) {
            let diferença = Math.floor(this.milisegundos / 1000);
            this.milisegundos += diferença;
        }
    }

    addHoras(h: number = 0) {
        this.horas += h;
    }

    addMinutos(min: number = 0) {
        this.checkMinutos();
        this.minutos += min;
        this.checkMinutos();
    }

    addSegundos(seg: number = 0) {
        this.checkSegundos();
        this.segundos += seg;
        this.checkSegundos();
    }

    addMilesegundos(ms: number = 0) {
        this.checkMilisegundos();
        this.milisegundos += ms;
        this.checkMilisegundos();
    }

    getHoras(): number {
        return this.horas;
    }

    getMinutos(): number {
        return this.minutos;
    }

    getSegundos(): number {
        return this.segundos;
    }

    getMilisegundos(): number {
        return this.milisegundos;
    }

    setHoras(h: number = 0) {
        this.horas = h;
    }

    setMinutos(min: number = 0) {
        this.checkMinutos();
        this.minutos = min;
        this.checkMinutos();
    }

    setSegundos(seg: number = 0) {
        this.checkSegundos();
        this.segundos = seg;
        this.checkSegundos();
    }

    setMilisegundos(ms: number = 0) {
        this.checkMilisegundos();
        this.milisegundos = ms;
        this.checkMilisegundos();
    }
}

export default Duração;
