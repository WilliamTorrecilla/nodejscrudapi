var express = require ('express');
var app = express();
var bodyParser = require ('body-parser');
var mongoose = require ('mongoose');
var Produto = require ('./app/models/product');

mongoose.connect('mongodb://localhost/dbCrud')
//config para a aplicacao usar o body-parser

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//definir onde a porta do servidor vai responder

var port = process.env.port || 8000;

//definindo as rotas

var router = express.Router(); //interceptação de todas as rotas

//middleware


router.use(function(req,res,next){
    console.log("interceptação do middleware");
    next();

});

router.get('/', function(req, res){
    res.json({"Message":" rota de teste funfando"});
});

router.route('/produtos/:productId')
.get(function(req,res){
    const id = req.params.productId;
    Produto.findById(id, function(err, produto){
        if(err){
            res.status(500).json({
                message:"Erro ao tentar encontrar o produto, ID mal formado"        
                        
            });


        }else if(produto == null){
            res.status(400).json({
                message:"produto nao encontrado",
                produto: produto
            });

        }else{
            res.status(200).json({
                message:"Produto encontrado",
                produto: produto

            });


        }

    });
})

.put(function(req,res){
    const id = req.params.productId;
    Produto.findById(id, function(err, produto){
        if(err){
            res.status(500).json({
                message:"Erro ao tentar encontrar o produto, ID mal formado"        
                        
            });


        }else if(produto == null){
            res.status(400).json({
                message:"produto nao encontrado",
           
            });

        }else{
            produto.nome = req.body.nome;
            produto.preco = req.body.preco;
            produto.descricao = req.body.descricao;

            produto.save(function(erro){
                if (erro)
                    res.send("erro ao atualizar o produto" + erro);
                    res.status(200).json({
                    Message:"Alterado com Sucesso"});

                });
            }
      });

    })

    //arrow function

    .delete(function(req,res){
        
        Produto.findByIdAndRemove(req.params.productId,(err, produto) => {
                if(err){
               return res.status(500).send(err);   
                }

                const response = {
                    message:"Produto removido com sucesso",
                    id:produto.id

                };
                return res.status(200).send(response);
            
            
            });
                            
        })


router.route('/produtos')
.post(function(req,res){
    var produto = new Produto();
    produto.nome = req.body.nome;
    produto.preco = req.body.preco;
    produto.descricao = req.body.descricao;

    produto.save(function(error){
        if(error){
            res.send("Erro ao salvar o produto");

        }
            res.status(201).json({Message: "Produto inserido com sucesso"})

    });

})

.get(function(req,res){
    Produto.find(function(err, prods){
        if(err)
        res.send(err);
    
        res.status(200).json({
            message:"produtos buscados com sucesso",
            todosProdutos:prods

        });

    });

});

// vinculo de aplicacao (app) com o motor de rotas

app.use('/api', router);

app.listen(port);
console.log("app is running on port" + port);
