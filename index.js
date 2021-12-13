import express from 'express'
import fetch from 'node-fetch'

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const PORT = process.env.PORT || 6500

app.listen(PORT, () => console.log('Server started on port ' + PORT))

async function obtenerCivilizaciones() {
    const response = await fetch('https://age-of-empires-2-api.herokuapp.com/api/v1/civilizations')
    return await response.json()
}


async function obtenerUnidades() {
    const response = await fetch('https://age-of-empires-2-api.herokuapp.com/api/v1/units')
    return await response.json()
}


const civilizaciones = await obtenerCivilizaciones()
const unidades = await obtenerUnidades()

app.get('/civilizaciones', (req, res) => {
    const mostrar = []
    civilizaciones.civilizations.map(e => {
        if (e.expansion === 'Age of Kings') {
            const obj = {
                id: e.id,
                name: e.name,
                army_type: e.army_type
            }
            mostrar.push(obj)
        }
    })
    res.send(mostrar)
})

app.get('/unidades', (req, res) => {
    const { nombre, ataque } = req.query
    const mostrar = []
    let obj = {}
    if (nombre != undefined && ataque != undefined) {
        unidades.units.map(e => {
            if (e.name.includes(nombre) && e.attack >= ataque) {
                obj = {
                    id: e.id,
                    name: e.name,
                    description: e.description,
                    expansion: e.expansion,
                    cost: {
                        Wood: e.cost.Wood,
                        Gold: e.cost.Gold
                    },
                    build_time: e.build_time,
                    attack: e.attack,
                    armor: e.armor
                }
                mostrar.push(obj)
            }
        })
        res.send(mostrar)
    } else if (nombre != undefined) {
        unidades.units.map(e => {
            if (e.name.includes(nombre)) {
                obj = {
                    id: e.id,
                    name: e.name,
                    description: e.description,
                    expansion: e.expansion,
                    cost: {
                        Wood: e.cost.Wood,
                        Gold: e.cost.Gold
                    },
                    build_time: e.build_time,
                    attack: e.attack,
                    armor: e.armor
                }
                mostrar.push(obj)
            }
        })
        res.send(mostrar)
    } else if (ataque != undefined) {
        unidades.units.map(e => {
            if (e.attack >= ataque) {
                obj = {
                    id: e.id,
                    name: e.name,
                    description: e.description,
                    expansion: e.expansion,
                    cost: {
                        Wood: e.cost.Wood,
                        Gold: e.cost.Gold
                    },
                    build_time: e.build_time,
                    attack: e.attack,
                    armor: e.armor
                }
                mostrar.push(obj)
            }
        })
        res.send(mostrar)
    }

})

app.get('/existe/:nombreCivilizacion', (req, res) => {
    const { nombreCivilizacion } = req.params
    let obj = {
        existe: false
    }
    civilizaciones.civilizations.map(e => {
        if (e.name.toLowerCase() === nombreCivilizacion.trim().toLowerCase()) {
            obj = {
                existe: true
            }
        }
    })
    res.json(obj)
})

app.post('/guardarPersona', (req, res) => {
    const { nombre, apellido } = req.body
    res.send(`Se ha guardado a ${nombre} ${apellido} en la base de datos`)
})