const modelDatos = require('./modelo');


const ctrlDatos = {
    getAdmin: async (req, res) => {
        const { id } = req.query;
        res.json(await modelDatos.getAdmin(id));
    },
    addUser: async (req, res) => {
        const { nombre, foto, fecha, uid } = req.body;
        res.json(await modelDatos.addUser(nombre, foto, fecha, uid));
    },
    addPost: async (req, res) => {
        const { uid, autor, mensaje, categoria, fecha } = req.body;
        res.json(await modelDatos.addPost(uid, autor, mensaje, categoria, fecha))
    },
    addPostWithImage: async (req, res) => {
        const { uid, descripcion, urlImagen, nombreFoto} = req.body;
        res.json(await modelDatos.addPostWithImage(uid, descripcion, urlImagen, nombreFoto));
    },
    getPosts: async (req, res) => {
        const { categoria } = req.body;
        res.json(await modelDatos.getPosts(categoria));
    },
    getMyPosts: async (req, res) => {
        const { uid } = req.body;
        res.json(await modelDatos.getMyPosts(uid));
    },
    sendMessage: async (req, res) => {
        const { uid, origen, fecha, mensaje } = req.body;
        res.json(await modelDatos.sendMessage(uid, origen, fecha, mensaje));
    },
    getMessages: async (req, res) => {
        const { uid } = req.body;
      //  var aux=await modelDatos.getMessages(uid)
        console.log("hola ");
       res.json(await modelDatos.getMessages(uid));
    },
    deletePost: async (req, res) => {
        const { idPost, categoria, idPost2, idAutor } = req.body;
        res.json(await modelDatos.deletePost(idPost, categoria, idPost2, idAutor));
    },
    editPost: async (req, res) => {
        const { idPost, categoria, text, fecha, idAutor, nameAutor, idPost2 } = req.body;
        res.json(await modelDatos.editPost(idPost, categoria, text, fecha, idAutor, nameAutor, idPost2));
    },
    sendMail: async (req, res) => {
        const { user, queja } = req.body;
        res.json(await modelDatos.sendMail(user, queja));
    },
    getQuejas: async(req, res) => {
        res.json( modelDatos.getQuejas());
    },
    deleteQuejas: async(req, res) => {
        res.json(await modelDatos.deleteQuejas());
    },
    getAllPosts: async(req, res) => {
        res.json(await modelDatos.getAllPosts());
    },
    sendUbication: async(req, res) => {
        const { user, lat, long } = req.body;
        res.json(await modelDatos.sendUbication(user,lat,long));
    },
    getUbications: async(req, res) => {
        const { lat, long } = req.body;
        res.json(await modelDatos.getUbications(lat,long));
    }

}









module.exports = ctrlDatos;