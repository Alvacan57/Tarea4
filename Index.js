const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

app.listen(3000, () => console.log("App escuchando en el puerto 3000!"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

mongoose
  .connect(
    "mongodb+srv://VANGUARDIA:vanguardia2022@vanguardia.hfd2v.mongodb.net/musica?retryWrites=true&w=majority"
  )
  .catch((error) => handleError(error));

const musicaSchema = new mongoose.Schema(
  {
    cancion: String,
    artista: String,
    album: String,
    anio: Number,
    pais: String,
  },
  {
    collection: "cancion",
  }
);
const cancion = mongoose.model("cancion", musicaSchema);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'public','index.html'));
});

app.get("/canciones/api", function(req, res) {
    cancion.find((err, cancion) => {
      if (err) res.status(500).send("Error en la base de datos");
      else res.status(200).json(cancion);
    });
  });
  
  app.post("/canciones/api", function (req, res) {
      const cancion1 = new cancion({ 
      cancion: req.body.cancion,   
      artista: req.body.artista,
      album: req.body.album,
      anio: req.body.anio,
      pais: req.body.pais,
    });

    cancion1.save(function(error, cancion1) {
      if (error) {
        res.status(500).send("No se ha podido agregar.");
      } else {
        res.status(200).json(cancion1);
      }
    });
  });

  app.get("/canciones/api/:id", function (req, res) {
    cancion.findById(req.params.id, function (err, cancion) {
      if (err) res.status(500).send("Error en la base de datos");
      else {
        if (cancion != null) {
          res.status(200).json(cancion);
        } else res.status(404).send("No se encontro ese registro");
      }
    });
  });

  app.delete("/canciones/api/:id", function (req, res) {
    cancion.findById(req.params.id, function (err, cancion) {
      if (err) res.status(500).send("Error en la base de datos");
      else {
        if (cancion != null) {
          cancion.remove(function (error, result) {
            if (error) res.status(500).send("Error en la base de datos");
            else {
              res.status(200).send("Eliminado exitosamente");
            }
          });
        } else res.status(404).send("No se encontro esa persona");
      }
    });
});

app.put("/canciones/api/:id", function (req, res) {
  cancion.findById(req.params.id, function (err, cancion) {
    if (err) res.status(500).send("Error en la base de datos");
    else {
      if (cancion != null) {
        cancion.cancion= req.body.cancion;
        cancion.artista = req.body.artista;
        cancion.album = req.body.album;
        cancion.anio = req.body.anio;
        cancion.pais = req.body.pais;
        cancion.save(function (error, cancion1) {
          if (error) res.status(500).send("Error en la base de datos");
          else {
            res.status(200).send("Modificado exitosamente");
          }
        });
      } else res.status(404).send("No se encontro esa persona");
    }
  });
});