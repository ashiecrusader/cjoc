const express = require('express')
const app = express();
const ejs = require('ejs')
const bodyParser = require("body-parser")
const path = require('path')
const session = require('express-session');

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs');


const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

initializeApp({
    credential: cert({
        projectId: 'gstorage-36a73',
        clientEmail: "firebase-adminsdk-o65o1@gstorage-36a73.iam.gserviceaccount.com",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCJ/K+6r9QJeEAO\nk3IkyX1e5VBMM0aGMldiycClyfkBuoXE3ZFxOK7tys6HDnUupJZHFVvJiNG+hy+m\n99uTqr79fyDqgSZHbxzByxKkZXO4oiEVY/RyyzsFRfUtv6d9e7xe0G3G1Qq204Eg\neC/E5PLXjlyuohQxV1EG0FCIdUswwA1RXvrxds2XgMGfHeqh/BEKc8UJfmv28cc1\ncpfRPOKe17kMPEiaA/dJE3VtunFvnOoIyUth+OYitCUdf4Vo9xlXj8ELpyXDHFRO\nc308a+psfdzl+ZhFy9kXPR0lJ5dcrgHLvUAkNHm3gjQ5hzxbg2p+OBql/XROUPfW\nqvVVvSlhAgMBAAECggEAANcjP8dhMvWomNHZlJq0tXw/KatdcGH6bpgUqe9QA+CE\nZxIMteathcgQ0VW1Ixa5qi7ilTlVv1wgTD1yh7eiJpDCmV/c9t2e3LosDeTGJQYG\n1AUyZ5VRszDHEb7u//9d7H3Px8OZSA9CH6xKmSn98CrXZkSBdYklF1mCU08VPiBE\nsdp0y/dkn6j/YQxlKGci6XS08sIh5/UdH902+qON0nTlSquoUBOVfVtSgYEv8zQb\npLxBIKv7X+YXwIg19xWWM+JgC5nO9jMKi1jxIB5HjP02e0MwE7YeTIv432U0i2kb\nEr8rBaFS9emfeJFTXWZbBvfIpy6atUAXPK2StqzklQKBgQC8966tvzjTUIQjAPsh\nKDru+/hzQgaywnQEqktaMqt5vBQlyCza9gXzNKhsA1eTuKE6PLJLKzHwTIBOWR1p\nJKgnul4eJQ+7tfOx6nkb4dcBgqZhL9U/Fqwi6XoI5DHrD4kBCA+eM0dD2nY2jLnD\ndO/dP/9sOiUIMZp4hr6S3elVUwKBgQC672vPEMxnNADUnP935Xd4hDujYi6sGJYB\nVqA/snOzOCizqGbUp9ysiD2aE17JLbh0cXttZnejWq7o0TRuud0lYg4T1Cy7zMe9\n1wZpkE1gh67sdBztI5K0sXGfldNNAxK76wkUn7oLDW6udEhoKYikkp3vLYLgR7mS\nE07YppZb+wKBgFB8hpBGpGONJdrq7gv/YKqt8/LTqpq1LElYZ2PxtQvSyhoVmtVg\neMRQJ3RqMAEhYLq3Y5GUwl6BlxzH5DkGfgD95lycmIjxRO0A27i+hp+EEG3Qu9l1\nRLhSDcJ/v6tJIKep0U0mtjH2eOdfJThVNF1ehuKIGYHV7t9rNPzFPD81AoGBAKsp\nY7ZB9FaeuA/0/LlkQyL3OMAduwxaqqbpEWuhUu0Lg8EUdatLU/Qp/vWfvM9J7LW5\n3sDJ7MuG0dZdD7w+tK1w/eDMCnWeSFmbk8R+m0rCkbjxjDbZto96VcZAYiwGn1Wv\nHC5lHezWzLwxvsaZGQNPOAryyf3fzptg0HXw+oWXAoGAQBWbTzfg4jaKeq8mG252\nB4MFQdGRxE3UzK8qM7UqlZ1k2iZexyNuzFnNnoKrkbj5LNrLW3GzeMutwAFvAvmX\nTjtp/y1WRBagLAgJEmyGL53oiJf9lOvi9Q9FT72dmSLDiJJZ7VVFzOstRP2M7kyR\nrrDOzGRdf30vD2Nbk2Xufvc=\n-----END PRIVATE KEY-----\n"
    })
})


const db = getFirestore();




app.use('/js', express.static('js'))
app.use('/css', express.static('css'))
app.use('/images', express.static('images'))
app.use('/vendor', express.static('vendor'))
app.use('/fonts', express.static('fonts'))


app.use(session({
	secret: 'CkXrYEK8yTNFKd3nwsMdDudgE3qb4fSfaIIUGT2SJhfMDcXKdceyegS3r5XJkSnMPqMGzx6GwiCV5Gw4ibT6Ij9QvVsC62qZwiJjErbDWmxCNNqzk1uYGu6E',
	resave: true,
	saveUninitialized: true
}));


// used for adding a field to all documents :)
async function bulk_update_documents() {

    const snapshot = await db.collection('logins').get();


    const promises = [];
    snapshot.forEach(doc => {
      promises.push(doc.ref.update({
        active: true
      }));
    });
    return Promise.all(promises)


}


app.post('/login', async function(request, response) {

    var username = request.body.name;
    var password = request.body.password;


    if(username && password) {

        await db.collection('logins').where('login', '==', username).get().then(async (querySnapshot) => {
            if (!querySnapshot.empty){

                const user = querySnapshot.docs[0].data();

                if(username === user.login && password === user.password) {
                    
                    request.session.cle = user.clearancelevel;
                    request.session.cuser = user.login;
                    request.session.cpass = user.password;
                    request.session.dcle = user.devClearance;
                    request.session.lgd = user;
                    request.session.active = user.active;
                    
                request.session.loggedin = true;
                
                response.redirect('/')

                } else {
                    response.redirect('/login')
                }
            } else {
                response.redirect('/login')
            }

            response.end();
        })
    } else {
        response.send("Please enter a username and a valid password")
        response.end();
    }

})


let mantz = false;
let msgz = ""

var mobileAccess = false



async function maintenance() {
    const actset = await db.collection('settings').where('category', '==', 'dev').get();

    actset.forEach(setting => {
        msgz = setting.data().cmsg
        mantz = setting.data().maintenance
    })

}

maintenance();

const setPost = db.collection('settings').doc('maintenance');

setPost.onSnapshot(doc => {
maintenance();
})

const mobilePost = db.collection('settings').doc('access');

mobilePost.onSnapshot(async (doc) => {

const actualSetting = await db.collection('settings').where('category', '==', 'access').get().then(async (querySnapshot) => {
    const setting = await querySnapshot.docs[0].data()
    mobileAccess = setting.mobile

})


})

async function isac(req, res) {

    await db.collection('logins').where('login', '==', req.session.cuser).get().then(async (querySnapshot) => {
            const user = await querySnapshot.docs[0].data();

            if(user.active === false) {
                req.session.active = false;
            } else {
                req.session.active = true;
            }

    })
}


function renmaint(res) {

    res.render('maintenance', {
        msga: msgz,
    })
}
  
async function broplease(req, res) {

    await db.collection('logins').where('login', '==', req.session.cuser).get().then(async (querySnapshot) => {

        const user = querySnapshot.docs[0].data();

        req.session.active = user.active;
    })
}


app.get('/', async function(req, res) {
    if (mantz === true) {
        renmaint(res);
        return
}


if (req.session.loggedin) {

await broplease(req, res)

    if(req.session.active === false) {
        res.render('disabled', {
            cuser: req.session.cuser
        })

        return;
    }

    res.render('mainpage', {
        cuser: req.session.cuser,
        devcle: req.session.dcle,
        mob: mobileAccess,
    })

    return;
}


res.redirect('/login')
})

app.get('/regasg', async function(req, res) {

    if (mantz) {
        remaint(res);
        return;
    }


    if(req.session.loggedin) {

        await broplease(req, res)

    if(req.session.active === false) {
        res.render('disabled', {
            cuser: req.session.cuser
        })

        return;
    }
        
        res.render('assign', {
            mob: mobileAccess,
            devcle: req.session.dcle,
        })
    } else {
        res.redirect('/')
    }

})

app.get('/assignments', async function(req, res) {

    if (mantz === true) {
        renmaint(res);
        return;
    }


    
    if(req.session.loggedin) {
        await broplease(req, res)

        if(req.session.active === false) {
            res.render('disabled', {
                cuser: req.session.cuser
            })
    
            return;
        }

        const snapshot = await db.collection('asgs').get();
        const unflattenedarray = snapshot.docs.map(doc => doc.data());


        res.render('assignments', {
            casg: unflattenedarray,
            mob: mobileAccess,
            devcle: req.session.dcle,
        })
    } else {
        res.redirect('/')
    }

})

app.get('/login', (req, res) => {
    if(req.session.loggedin) {
        res.redirect('/')
        return;
    }

    res.render('login')

})

app.get("/accdash", async (req, res) => {
    
    if (mantz === true) {
        renmaint(res);
        return
}

    if (req.session.loggedin) {
        await broplease(req, res)

        if(req.session.active === false) {
            res.render('disabled', {
                cuser: req.session.cuser
            })
    
            return;
        }

        res.render('accountdash', {
            loginData: req.session.lgd,
            mob: mobileAccess
    
        })
        return;
    } 
    
    res.redirect('/login')

})

// app.get("/login-data/", async (req, res) => {

//     require('./models/login')
//     const loginModel = mongoose.model('Login')
//     const loginData = await loginModel.find({})


//     res.render('datalogin', {
//         logind: loginData
//     })

//     });

app.get("/notsupported", async (req, res) => {

    if (mantz === true) {
        renmaint(res);
        return
}
    if (req.session.loggedin) {
        res.render('mobile', {
            mob: mobileAccess
        })
        return;
    } 
    
    res.redirect('/login')

})

app.get('/removedoc', async (req, res) => {

    if (mantz === true) {
        renmaint(res);
        return
}



    if (req.session.loggedin) {
        await broplease(req, res)

        if(req.session.active === false) {
            res.render('disabled', {
                cuser: req.session.cuser
            })
    
            return;
        }

        res.render('revdoc', {
            gaf: "n",
            mob: mobileAccess
    
        })
        return;
    } 
    
    res.redirect('/login')

})


app.get("/documents/", async (req, res) => {


if (mantz === true) {
    renmaint(res);
    return
}



if (req.session.loggedin) {
    await broplease(req, res)

    if(req.session.active === false) {
        res.render('disabled', {
            cuser: req.session.cuser
        })

        return;
    }

    const docData = []

    for (var i = 1; i <= req.session.cle; i++) {
        let topush = await db.collection('documents').where('cle', '==', i).get();
        
        if(topush) {

        topush.forEach(doc => {

            const data = {
                title: doc.data().title,
                writtenby: doc.data().writtenby,
                link: doc.data().link,
                id: doc.id
            }

            docData.push(data);
        })
        }
    }

    let something3 = docData.flat(1)


res.render('documents', {
    docs: something3,
    clevel: req.session.cle,
    mob: mobileAccess

})
    return;
} 

res.redirect('/login')

   

})

app.get("/newdocument/", async (req, res) => {
    if (mantz === true) {
        renmaint(res);
        return
}





    if (req.session.loggedin) {
        await broplease(req, res)

        if(req.session.active === false) {
            res.render('disabled', {
                cuser: req.session.cuser
            })
    
            return;
        }

        res.render('newdocs', {
            mob: mobileAccess
    
        })
        return;
    } 
    
    res.redirect('/login')




})


app.get('/reg', async (req, res) => {

    if (mantz === true) {
        renmaint(res);
        return
}




    if (req.session.loggedin) {
        await broplease(req, res)

        if(req.session.active === false) {
            res.render('disabled', {
                cuser: req.session.cuser
            })
    
            return;
        }
        if(req.session.dcle >= 3) {
            res.render('register', {
                devcle: req.session.dcle,
                mob: mobileAccess
        
            })
            return;
        } else {
            res.redirect('/')
            return;
        }
    } 
    
    res.redirect('/login')

})

app.get('/deldoc', async (req, res) => {
    if (mantz === true) {
        renmaint(res);
        return
}


    if (req.session.loggedin) {
        await broplease(req, res)

        if(req.session.active === false) {
            res.render('disabled', {
                cuser: req.session.cuser
            })
    
            return;
        }

        res.render('deletedoc', {
            mob: mobileAccess
        })
        return;
    } 
    
    res.redirect('/login')


})






app.post('/rez', async function(req, res) {

const data = {
    login: req.body.name,
    password: req.body.pass,
    clearancelevel: parseInt(req.body.clea),
    asg: req.body.asg,
    devClearance: parseInt(req.body.dcle),
    active: true
}

await db.collection('logins').doc().set(data);

})

const cheerio = require('cheerio')



app.post('/pez', async function(req, res) {

if(req.body.id === "") {
    return;
}

    var doesTheDocumentExist = await db.collection('documents').doc(req.body.id)

    if(!doesTheDocumentExist.empty) {

        await db.collection('documents').doc(`${req.body.id}`).delete();

        var $ = cheerio.load('revdoc');
        var scriptNode = '<script>alert("Document Removed!");</script>';
        $('body').append(scriptNode);
        res.send($.html());

    } 
})

app.post("/gaz", async function(req, res) {

    const data = {
        link: req.body.link,
        writtenby: req.body.writtenby,
        title: req.body.name,
        cle: parseInt(req.body.cle),
    }

    vadilateLink = req.body.link.replace(/\s+/g, '');
    vadilateWrittenby = req.body.writtenby.replace(/\s+/g, '');
    vadilateName = req.body.name.replace(/\s+/g, '');
    vadilateCle = req.body.cle.replace(/\s+/g, '');

    if(vadilateLink === "" || vadilateWrittenby === "" || vadilateName === "" || vadilateCle === "") {
        // alert("Please fill in all of the fields appropiately.")
        // res.redirect('/newdocument')
        console.log('not added')
        return
    }

await db.collection('documents').where('link', '==', req.body.link).get().then(async (querySnapshot) => {
    if(querySnapshot.empty){
        await db.collection('documents').doc().set(data);
    }
})


})

app.post('/asgreg', async function (req, res) {

    const acdue = new Date(req.body.due)

    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
       }
       return result;
    }

    var finalid = makeid(10)

    const data = {
        title: req.body.title,
        asgto: req.body.asgto,
        due: acdue,
        id: finalid
    }

    await db.collection('asgs').doc().set(data);


})

app.post('/asgrem', async function (req, res) {

    var id = req.body.id


    await db.collection('asgs').where('id', '==', id).get().then(async (querySnapshot) => {

        const foundDocument = querySnapshot.docs[0].id;

        await db.collection('asgs').doc(foundDocument).delete();
    })
})

app.post('/psrwd', async function(req, res) {

    vadilPass = req.body.newpass.replace(/\s+/g, '');

    if(vadilPass === "") {
        return
    }

    let str = req.body.newpass
    if(str.includes(" ")) {
        return
    }

    if(req.body.newpass.length > 20){
        return
    }

   const logdat = await db.collection('logins').where('login', '==', req.session.cuser).get().then(async (querySnapshot) => {
       const user = querySnapshot.docs[0].data();

       await db.collection('logins').doc(querySnapshot.docs[0].id).update({
           password: req.body.newpass
       })
   })

    res.redirect('/')

})

app.post('/logoutin', async function(req, res) {
req.session.loggedin = false;
res.redirect('/')
})


function mainpage(res) {
    if (mantz === true) {
        renmaint(res);
        return


}
}





    const listener = app.listen(2005, () => {
        console.log("Your app is listening on port " + listener.address().port);
      });
