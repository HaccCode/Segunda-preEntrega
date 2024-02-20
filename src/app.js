import express from 'express'
import handlebars from 'express-handlebars'
// import { uploader } from "./utils.js";
import fs from 'fs/promises';
import __dirname from './utils.js'
// import { v4 as uuidv4 } from 'uuid';
import viewsRouter from './routes/views.router.js'


//Configuraciones Express
const app = express();
const server = app.listen(8080,()=>console.log("Listening in PORT 8080"))
app.use(express.json());
app.use(express.urlencoded({extended:true}))

//Configuraciones Handlebars + Static
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + 'public'))


//Middlewares
const validateFields = (req, res, next) => {
    const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).send(`El campo ${field} es obligatorio.`);
        }
    }
    next();
};

const checkFilesExistence = async (req, res, next) => {
    try {
        await fs.access('productos.json');
    } catch (error) {
        await fs.writeFile('productos.json', '[]');
    }

    try {
        await fs.access('carrito.json');
    } catch (error) {
        await fs.writeFile('carrito.json', '[]');
    }

    next();
};

app.use(checkFilesExistence);



const cartsRouter = express.Router();
cartsRouter.post('/', async (req, res) => {
    try {
        const newCart = {
            id: uuidv4(),
            products: [],
        };

        const cartsData = await fs.readFile('carrito.json', 'utf-8');
        const carts = JSON.parse(cartsData);
        carts.push(newCart);

        await fs.writeFile('carrito.json', JSON.stringify(carts, null, 2));

        res.json(newCart);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error!!!');
    }
});

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartsData = await fs.readFile('carrito.json', 'utf-8');
        const carts = JSON.parse(cartsData);
        const cart = carts.find((c) => c.id === cartId);

        if (!cart) {
            res.status(404).send('404 Not Found');
        } else {
            res.json(cart.products);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error!!!');
    }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;

        const cartsData = await fs.readFile('carrito.json', 'utf-8');
        let carts = JSON.parse(cartsData);
        const cartIndex = carts.findIndex((c) => c.id === cartId);

        if (cartIndex !== -1) {
            const productIndex = carts[cartIndex].products.findIndex((p) => p.product === productId);

            if (productIndex !== -1) {
                carts[cartIndex].products[productIndex].quantity += quantity;
            } else {
                carts[cartIndex].products.push({ product: productId, quantity });
            }

            await fs.writeFile('carrito.json', JSON.stringify(carts, null, 2));

            res.json(carts[cartIndex]);
        } else {
            res.status(404).send('404 Not Found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error!!!');
    }
});
app.use('/api/carts', cartsRouter);

app.use('/', viewsRouter)

export default app


