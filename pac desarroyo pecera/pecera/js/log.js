class Log {
    constructor(nombreAlumno) {
        this.nombreAlumno = nombreAlumno;
        this.horaEjecucion = new Date().toLocaleTimeString();
        this.navegador = navigator.userAgent;
        this.listaPeces = [];
    }

    registrarPez(pez) {
        this.listaPeces.push({
            nombre: pez.nombre, 
            imagen: pez.imagen,
            x: pez.x,
            y: pez.y,
            tipoMovimiento: pez.tipoMovimiento
        });
    }

    obtenerLog() {
        return {
            nombreAlumno: this.nombreAlumno,
            horaEjecucion: this.horaEjecucion,
            navegador: this.navegador,
            listaPeces: this.listaPeces
        };
    }

    crypt(texto, clave = "123456789") {
        return CryptoJS.AES.encrypt(texto, clave).toString();
    }

    decrypt(textoEncriptado, clave = "123456789") {
        const bytes = CryptoJS.AES.decrypt(textoEncriptado, clave);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    formatearLog() {
        let logTexto = `Nombre Alumno: ${this.nombreAlumno}\nHora: ${this.horaEjecucion}\nNavegador: ${this.navegador}\n`;
        this.listaPeces.forEach((pez, index) => {
            logTexto += `Pez${index + 1}: ${pez.nombre} y movimiento ${pez.tipoMovimiento}\n`;
        });
        return logTexto;
    }
    
}
