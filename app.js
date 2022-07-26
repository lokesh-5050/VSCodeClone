const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')


app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, "/public")))

app.get('/', (req, res) => {

  fs.readdir("./uploads", { withFileTypes: true }, (err, data) => {

    const files = data.filter((elem) => !elem.isDirectory());
    const folders = data.filter((elem) => elem.isDirectory());

    res.render("index", { files, folders })
  })
});


app.get('/newfile', function (req, res) {
  fs.writeFile(`./uploads/${req.query.newfile}`, "", function (err) {
    res.redirect('/')
  })
});


app.get('/newfolder', function (req, res) {
  fs.mkdir(`./uploads/${req.query.newfolder}`, function (err) {
    res.redirect('/')
  })
});


app.get('/files/:filename', (req, res) => {
  fs.readdir('./uploads', { withFileTypes: true }, (err, data) => {
    if (err) throw err;
    const files = data.filter((elem) => !elem.isDirectory());
    const folders = data.filter((elem) => elem.isDirectory());
    fs.readFile(`./uploads/${req.params.filename}`, (err, filecontent) => {
      if (err) throw err;



      res.render('filecontent', { files, folders, filecontent, tabname: req.params.filename, data })

    })
  })
})

app.get('/unlinkfile/:delFile', function (req, res) {
  fs.unlink(`./uploads/${req.params.delFile}`, function (err) {
    if (err) throw err
    res.redirect("back")
  })

});

app.get('/unlinkfolder/:delFile', function (req, res) {

  fs.rmdir(`./uploads/${req.params.delFile}`, function (deleted) {
    if (deleted) throw deleted
    res.redirect("back")

  })

});

// app.get('/unlinkFolder/:delFile', function(req,res){
//   // fs.unlink(`./uploads/${req.params.delFile}`, function(err){
//   //   res.redirect("back")
//   // })


//   fs.rmdir(`./uploads/${req.params.delFile}` , function(deleted){
//     if(deleted) throw deleted
//     res.redirect("back")

//   })



// });






// app.get('/unlink/:delFile', function(req,res){
//   fs.rmdir(`./uploads/${req.params.delFile}`, function(err){
//     res.redirect('/')
//   })

// })



app.get("/refresh", (req, res) => {
  res.redirect("back")
})



app.get("/saveData/:filename", function (req, res) {
  fs.writeFile(`./uploads/${req.params.filename}`, `${req.query.saveData}`, (err) => {
    if (err) throw err
    res.redirect(req.headers.referer)
    // res.send(req.query.saveData)
  })
})



//test to remove directory

// fs.rmdir(`./uploads/lokesh` , function(deleted){
//   if(deleted) throw deleted  
// })   // chal rha hai ye to!!


app.get("/rename/:filename", (req, res) => {
  fs.rename(`./uploads/${req.params.filename}`, `./uploads/${req.query.filename}`, (err) => {
    if (err) throw err
    res.redirect("back")
  })
})


app.listen(3000)