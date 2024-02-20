import express from 'express';

const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
    try {
        const productsData = await fs.readFile('productos.json', 'utf-8');
        const products = JSON.parse(productsData);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error!!!');
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const productsData = await fs.readFile('productos.json', 'utf-8');
        const products = JSON.parse(productsData);
        const product = products.find((p) => p.id === productId);

        if (!product) {
            res.status(404).send('404 Not Found!!');
        } else {
            res.json(product);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error!!!');
    }
});

productsRouter.post('/', validateFields, async (req, res) => {
    try {
        const newProduct = {
            id: uuidv4(),
            title: req.body.title,
            description: req.body.description,
            code: req.body.code,
            price: req.body.price,
            status: req.body.status !== undefined ? req.body.status : true,
            stock: req.body.stock,
            category: req.body.category,
            thumbnails: req.body.thumbnails || [],
        };

        const productsData = await fs.readFile('productos.json', 'utf-8');
        const products = JSON.parse(productsData);
        products.push(newProduct);

        await fs.writeFile('productos.json', JSON.stringify(products, null, 2));

        res.json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error!!!');
    }
});

productsRouter.put('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        
        const productsData = await fs.readFile('productos.json', 'utf-8');
        let products = JSON.parse(productsData);
        const index = products.findIndex((p) => p.id === productId);
        const currentProduct = products[index];
        const updatedProduct = {
            id: productId,
            title: req.body.title || currentProduct.title,
            description: req.body.description || currentProduct.description,
            code: req.body.code || currentProduct.code,
            price: req.body.price || currentProduct.price,
            status: req.body.status !== undefined ? req.body.status : true,
            stock: req.body.stock || currentProduct.stock,
            category: req.body.category || currentProduct.category,
            thumbnails: req.body.thumbnails || currentProduct.thumbnails || [],
        };
        if (index !== -1) {
            products[index] = updatedProduct;
            await fs.writeFile('productos.json', JSON.stringify(products, null, 2));
            res.json(updatedProduct);
        } else {
            res.status(404).send('404 Not Found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error!!!');
    }
});

productsRouter.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const productsData = await fs.readFile('productos.json', 'utf-8');
        let products = JSON.parse(productsData);
        products = products.filter((p) => p.id !== productId);

        await fs.writeFile('productos.json', JSON.stringify(products, null, 2));

        res.send('Producto eliminado exitosamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error!!!');
    }
});
app.use('/api/products', productsRouter);

export default router