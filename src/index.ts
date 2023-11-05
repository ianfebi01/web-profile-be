import express ,{Express} from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app:Express = express()

app.use(express.json())

// Cors
app.use(cors())

// Port
const PORT: string = process.env.PORT ?? "8000"

app.get("/", (req,res)=>{
    res.send('halo syg')
})

app.listen(PORT, () => { console.log('listening on port', PORT) })
