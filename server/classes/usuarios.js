class Usuarios {
    constructor() {
        this.personas = [];
    }

    addPersona(id, nombre, sala) {
        let persona = {
            id,
            nombre,
            sala
        }
        this.personas.push(persona);
        return this.personas;
    }

    getPersona(id) {
        let persona = this.personas.filter((persona_) => {
            return persona_.id === id;
        })[0]; //Como se recibe un arreglo, para recibir lo de dentro

        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        return this.personas.filter((persona) => {
            return persona.sala === sala
        });
    }

    deletePersona(id) {
        let personaBorrada = this.getPersona(id);

        this.personas = this.personas.filter((persona_) => {
            return persona_.id !== id;
        });

        return personaBorrada;
    }
}

module.exports = {
    Usuarios
}