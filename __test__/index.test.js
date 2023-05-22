const request = require("supertest")
const url = "http://localhost:8082"

describe('Testear GET ruta personaje, personaje aleatorio.',()=>{
    test("Deberia regresar codigo 200 y su el body",async()=>{
        let response = await request(url).get('/personaje')
        expect(response.statusCode).toBe(200)
        console.log(response.body)
})
})

describe('Testear GET ruta personaje por el id.',()=>{
    test("Deberia regresar codigo 200 y el body",async()=>{
        let response = await request(url).get('/personaje/i/51')
        expect(response.statusCode).toBe(200)
        console.log(response.body)
})
})

describe('Testear GET ruta personaje por el nombre.',()=>{
    test("Deberia regresar codigo 200 y el body",async()=>{
        let response = await request(url).get('/personaje/n/Keqing')
        expect(response.statusCode).toBe(200)
        console.log(response.body)
})
})
